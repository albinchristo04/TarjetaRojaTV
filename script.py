import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from urllib.parse import urljoin, urlparse
import time

class RojadirectaScraper:
    def __init__(self):
        self.base_url = "http://www.rojadirecta.eu/"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
    
    def get_nested_iframe(self, url):
        """Extract the actual playable iframe from nested iframes"""
        try:
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for iframe tags
            iframes = soup.find_all('iframe')
            
            for iframe in iframes:
                src = iframe.get('src', '')
                if src:
                    # Check if this looks like a stream URL
                    if any(domain in src for domain in ['canales.php', 'player', 'stream', 'live']):
                        return src
                    # Try to follow one more level
                    if src.startswith('http'):
                        try:
                            nested_response = self.session.get(src, timeout=5)
                            nested_soup = BeautifulSoup(nested_response.content, 'html.parser')
                            nested_iframe = nested_soup.find('iframe')
                            if nested_iframe and nested_iframe.get('src'):
                                return nested_iframe.get('src')
                        except:
                            pass
            
            # If no iframe found, look for video sources
            video_tags = soup.find_all(['video', 'source'])
            for tag in video_tags:
                src = tag.get('src', '')
                if src:
                    return src
            
            return url  # Return original if no nested iframe found
            
        except Exception as e:
            print(f"Error extracting nested iframe from {url}: {str(e)}")
            return url
    
    def parse_time(self, time_str):
        """Parse time string to datetime object"""
        try:
            # Time is in format HH:MM
            return time_str.strip()
        except:
            return None
    
    def scrape_matches(self):
        """Scrape all match events from Rojadirecta"""
        try:
            response = self.session.get(self.base_url, timeout=15)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            matches = []
            
            # Find all match containers
            match_spans = soup.find_all('span', class_=re.compile(r'^\d+$'))
            
            for match_span in match_spans:
                try:
                    match_data = self.extract_match_data(match_span)
                    if match_data:
                        matches.append(match_data)
                except Exception as e:
                    print(f"Error parsing match: {str(e)}")
                    continue
            
            return matches
            
        except Exception as e:
            print(f"Error scraping matches: {str(e)}")
            return []
    
    def extract_match_data(self, match_span):
        """Extract data from a single match container"""
        match_data = {
            'title': '',
            'sport': '',
            'competition': '',
            'date': '',
            'time': '',
            'end_time': '',
            'streams': []
        }
        
        # Find the menu title div
        menu_title = match_span.find('div', class_='menutitle')
        if not menu_title:
            return None
        
        # Extract date from meta tag
        meta_date = menu_title.find('meta', {'name': re.compile(r'^fe\d+$')})
        if meta_date:
            match_data['date'] = meta_date.get('content', '')
        
        # Extract time
        time_span = menu_title.find('span', class_='t')
        if time_span:
            match_data['time'] = time_span.get_text(strip=True)
        
        # Extract sport and competition
        onclick_text = menu_title.get_text(strip=True)
        
        # Parse sport
        sport_match = re.search(r'\d+:\d+\s+(.+?)\s+\(', onclick_text)
        if sport_match:
            match_data['sport'] = sport_match.group(1).strip()
        
        # Parse competition
        comp_match = re.search(r'\((.+?)\):', onclick_text)
        if comp_match:
            match_data['competition'] = comp_match.group(1).strip()
        
        # Extract match title
        title_span = menu_title.find('span', itemprop='name')
        if title_span:
            match_data['title'] = title_span.get_text(strip=True)
        
        # Extract end time if available
        time_spans = menu_title.find_all('span', class_='t')
        if len(time_spans) > 1:
            match_data['end_time'] = time_spans[-1].get_text(strip=True)
        
        # Find the submenu with streams
        submenu = match_span.find('span', class_='submenu')
        if submenu:
            streams_table = submenu.find('table', class_='taboastreams')
            if streams_table:
                match_data['streams'] = self.extract_streams(streams_table)
        
        return match_data
    
    def extract_streams(self, table):
        """Extract stream information from the streams table"""
        streams = []
        
        rows = table.find_all('tr')[1:]  # Skip header row
        
        for row in rows:
            cols = row.find_all('td')
            if len(cols) < 6:
                continue
            
            stream = {
                'p2p': cols[0].get_text(strip=True),
                'name': cols[1].get_text(strip=True),
                'language': cols[2].get_text(strip=True),
                'type': cols[3].get_text(strip=True),
                'bitrate': cols[4].get_text(strip=True),
                'url': '',
                'nested_iframe': ''
            }
            
            # Extract URL
            link = cols[5].find('a')
            if link:
                stream['url'] = link.get('href', '')
                
                # Extract nested iframe (this may take time)
                if stream['url']:
                    print(f"Extracting nested iframe from: {stream['url']}")
                    stream['nested_iframe'] = self.get_nested_iframe(stream['url'])
                    time.sleep(0.5)  # Be respectful with requests
            
            streams.append(stream)
        
        return streams
    
    def save_to_json(self, matches, filename='rojadirecta_matches.json'):
        """Save matches to JSON file"""
        output = {
            'scraped_at': datetime.now().isoformat(),
            'total_matches': len(matches),
            'matches': matches
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"Saved {len(matches)} matches to {filename}")

def main():
    scraper = RojadirectaScraper()
    
    print("Starting Rojadirecta scraper...")
    print("This may take a while as we extract nested iframes...")
    
    matches = scraper.scrape_matches()
    
    print(f"\nFound {len(matches)} matches")
    
    # Save to JSON
    scraper.save_to_json(matches)
    
    # Print summary
    print("\n=== Summary ===")
    for i, match in enumerate(matches, 1):
        print(f"{i}. {match['time']} - {match['sport']} - {match['title']} ({len(match['streams'])} streams)")

if __name__ == "__main__":
    main()

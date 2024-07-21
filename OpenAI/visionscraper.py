import time
from dotenv import load_dotenv
import openai
from selenium.webdriver.support.ui import WebDriverWait

load_dotenv(override=True)
openai.api_key = os.environ.get('OPENAI_API_KEY')

url = 'https://savage-software.co.uk'

driver.get(url)

# Wait until the page has fully loaded
WebDriverWait(driver, 10).until(
    lambda d: d.execute_script('return document.readyState') == 'complete'
)

# Add a very brief sleep to ensure that it is fully loaded
time.sleep(0.1)

from typing import List

def take_screenshots_scroll(driver: webdriver.Chrome, filepath: str='screenshot') -> List[str]:
    last_height = 0
    screenshots = []
    
    while True:
        # Take a screenshot
        filename = f'{filepath}_{len(screenshots)}.png'
        driver.save_screenshot(filename)
        screenshots.append(filename)

        # Scroll down by one viewport height and wait for the scroll to load
        driver.execute_script("window.scrollBy(0, window.innerHeight);")
        time.sleep(2)  # Wait for scroll to finish

        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return window.pageYOffset")
        if new_height == last_height:
            # If heights are the same, it is the end of the page
            break
        last_height = new_height


    return screenshots

# Take all the screenshots
screenshots = take_screenshots_scroll(driver)
# Exit the driver as we are done with the browser now
driver.quit()

from PIL import Image

def stitch_images_vertically(images: List[str], output_filename: str='stitched.png'):
    images = [Image.open(x) for x in images]
    widths, heights = zip(*(i.size for i in images))

    total_height = sum(heights)
    max_width = max(widths)

    stitched_image = Image.new('RGB', (max_width, total_height))

    y_offset = 0
    for im in images:
        stitched_image.paste(im, (0, y_offset))
        y_offset += im.height

    stitched_image.save(output_filename)
    stitch_images_vertically(screenshots)
    
    import base64

def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

# Initialize OpenAI client
client = OpenAI()

# Make a call to the OpenAI Vision API
response = client.chat.completions.create(
  model="gpt-4-vision-preview",
  messages=[
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "Please provide a breakdown of the services provided by the site?"},
        {
          "type": "image_url",
          "image_url": {
            "url": f"data:image/jpeg;base64,{encode_image(screenshot_path)}",
            # replace with high or low detail based on requirements
            "detail": "high"
          },
        },
      ],
    }
  ],
  max_tokens=300,
)

# Print the AI's response
print(response.choices[0].message.content)
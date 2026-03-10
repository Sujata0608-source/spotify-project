Spotify Clone - Dynamic Web Audio Player
A fully functional, responsive music streaming interface built with Vanilla JavaScript, HTML5, and CSS3. This project mimics the core user experience of Spotify, featuring dynamic album loading and a custom-built audio controller.

🚀 Features
Dynamic Album Loading: Automatically fetches and parses song lists from server-stored folders using custom metadata.

Custom Audio Controls: Fully interactive play/pause, next/previous, and seek functionality.

Intelligent Path Parsing: Uses advanced Regular Expressions (Regex) and the URL API to extract clean song titles from encoded server paths (handling both / and %5C delimiters).

Responsive Design: Includes a functional hamburger menu and fluid layouts for seamless use on mobile, tablet, and desktop screens.

Volume & Mute Toggle: Precise volume control with a synchronized range slider and a one-click mute/unmute icon toggle.

Real-time UI Sync: The seekbar and time display update in real-time as the music plays.

🛠️ Technical Highlights
Robust String Parsing
To solve the issue of varying local server URL encodings, I implemented a non-consuming Positive Lookahead Regex to isolate filenames regardless of the directory depth:

JavaScript
// Matches the last forward slash OR an encoded backslash
let parts = element.href.split(/\/(?=[^\/]*$)|%5C/);
Dynamic DOM Generation
The app avoids hardcoded HTML by fetching folder contents and dynamically injecting <li> elements into the playlist, ensuring that adding a new album folder automatically updates the UI.

The overall view of the website in action:  

<img width="931" height="293" alt="image" src="https://github.com/user-attachments/assets/0bab1fd8-a22e-41f0-b62e-a17820613223" />

The dynamic album loading in action:

<img width="549" height="294" alt="image" src="https://github.com/user-attachments/assets/d3be3273-9544-4aee-bb64-2f396d7bfcd8" />

The seekbar jump in action:

<img width="676" height="60" alt="image" src="https://github.com/user-attachments/assets/2759fc23-a62b-478c-808e-db560c2f4c92" />

⚙️ Installation & Setup
Clone the repository:

Bash
git clone https://github.com/your-username/spotify-clone.git
Project Structure:
Ensure your music is organized in the following format:

Plaintext
/songs
   /Album_Name
      info.json (metadata)
      song1.mp3
      song2.mp3
Run a Local Server:
Since the project uses fetch() to access song folders, you must run it on a local server (e.g., using the "Live Server" extension in VS Code).

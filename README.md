<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/open-whisperer">
    <img src="./apps/web-ui/public/icon_color.png" alt="Logo" width="120" height="86">
  </a>

<h3 align="center">Open Whisperer</h3>

  <p align="center">
    AI Video Translator and Subtitler
    <br />
    <a href="https://othneildrew.dev/demo/open-whisperer"><strong>Try the demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/othneildrew/open-whisperer/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/othneildrew/open-whisperer/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#docker-installation">Docker Installation</a></li>
        <li><a href="#manual-installation">Manual Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Open Whisperer Showcase](_dev/whisper-showcase-720.gif)

The motivation for this project was two reasons: (1) I'm trying to learn Spanish so this is a fun way to translate and learn from any video and (2) I wanted to get back into python development focusing on some form of AI/machine learning.

The project's initial scope has been severely limited to reach a quick MVP and get a working app that can be self-hosted and used as a tool right away.

*Expect bugs & beware of gremlins!*

> Btw: The name "open whisperer" is a play on the main open source project that drives this project ([OpenAI's whisper](https://github.com/openai/whisper)). I just choose the name to get started and kept it until now; it does not indeed to infringe on any copyrights or trademarks held by Open AI.

For the devs learning to code (I mean, we're all learning, but...), this is a mono-repo; if you're not familiar with this type of app, I came across a nice resource that explains the motivation behind it. It's the most extensive and helpful I've found.

Check it out here: https://monorepo.tools/


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

[![ffmpeg-python][ffmpeg]](https://github.com/kkroening/ffmpeg-python)
[![OpenAI Whisper][openai]](https://github.com/kkroening/ffmpeg-python)
[![argostranslate][argos]](https://pypi.org/project/argostranslate/)
[![Next][Next.js]][Next-url]



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps. 

> Note: You will need about ~14GB available space for all the AI language models.


### Prerequisites

1. Docker (recommended)

or

1. node@^22.14.0
2. python@^3.11
3. yarn@3.8.7


### Docker Installation

1. Install Docker: https://www.docker.com/get-started
2. Pull the Docker image
   ```sh
   docker pull othneildrew/open-whisperer:latest
   ```
3. Run the container
   ```sh
   docker run -d --name open-whisperer
   ```
4. Verify the container is running
   ```sh
   docker ps
   ```
5. Access the Web UI
    Visit http://localhost:3567
6. Enjoy
   

### Manual Installation

A great deal of effort went into making sure it runs without issue on docker, just try it and report back if you run into any issues.

// TODO: write manual installation instructions. But in the meanwhile, do use venv

1. Activate the virtual environment

```bash
# For windows
venv/Scripts/activate

# macOS/Linux
venv/bin/activate
```



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

The app features a simple and easy to use interface that allows choosing from different languages to translate to and from.

Of course no AI model is 100% accurate so don't rely on this program where 100% accurate transcript/translations are required for your use.

The usage is self-explanatory and each button highlights green when you're ready to move to the next step.

The demo version has upload limits and may include other restrictions and/or scanning of media to comply with some local laws, it is recommended to use the self-hosted option via docker if you need higher limits.



<!-- ROADMAP -->
## Roadmap

This is a very rough outline of how I may go about adding new features; the roadmap somewhat follows the order of importance right now for my use case.

*Please, do not depend on this project as it is not stable and development may be sporadic.*

Feel free to clone the project and make your own changes.

PRs are always welcome, and I'll be happy to merge any that make sense with the general direction of the project. 


### MVP

- [x] Setup pipeline (extract audio, transcriptions, translation, muxing) and working app
- [x] Docker image for self hosted option
- [x] Easily maintainable and well-structured mono repo


### V1

- [ ] Ability to edit the transcript before applying it to video
- [ ] Allow applying source language subtitles to video
- [ ] Show list of previously generated .srt files to quickly reuse and/or download
- [ ] Sync video & transcript when user clicks video it should sync both
- [ ] Add wavesurfer audio visualizer to show events & subtitle timeline
- [ ] Speaker diarization (recognize how many speakers spoke, when & which of either gender the speaker(s) are)
- [ ] Event-based status reporting with background tasks


### V2

- [ ] Add voice cloning to overdub videos in translated language (support different accents, gender)
- [ ] Support different style "templates" for subtitle styles
- [ ] Edit placement of subtitles
- [ ] Detect duplicate video sources
- [ ] Support uploading audio only and generating transcript w/ option to output karaoke style blank video
- [ ] Take advantage of hardware acceleration


### Way into the future

- [ ] More advance cropping/slicing and basic editing videos (to cut dead-space)
- [ ] Support concurrent uploads (multiple videos/audio at the same time w/ status reporting)


See the [open issues](https://github.com/othneildrew/open-whisperer/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/amazing-feature-i-want-to-add`)
3. Commit your Changes (`git commit -m 'Add some amazing-feature-i-want-to-add'`)
4. Push to the Branch (`git push origin feat/amazing-feature-i-want-to-add`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Othneil Drew - [@othneildrew](https://linkedin.com/in/othneildrew) - codeguydrew@gmail.com

Project Link: [https://github.com/othneildrew/open-whisperer](https://github.com/othneildrew/open-whisperer)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

After much research, I've come across these amazing set of tools/projects that made this one possible.

Big shout out to these amazing resources! Some aren't used yet, but these are more than likely what I will be using to implement other features on the roadmap.


| Task                          | Tool                                                                                                  | Notes                                                                                                   |
|-------------------------------|-------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **Audio Extraction**          | `ffmpeg`                                                                                              | Industry standard                                                                                       |
| **Language Detection**        | [Whisper](https://github.com/openai/whisper)                                                          | Detects and transcribes; use [faster-whisper](https://github.com/guillaumekln/faster-whisper) for speed |
| **Multi-Speaker Diarization** | [pyannote-audio](https://github.com/pyannote/pyannote-audio)                                          | Best diarization tool (offline support with Hugging Face model download)                                |
| **Translation**               | [argos-translate](https://github.com/argosopentech/argos-translate)                                   | Offline translation, install language pairs                                                             |
| **Voice Synthesis (TTS)**     | [Tortoise TTS](https://github.com/neonbjb/tortoise-tts), [Coqui TTS](https://github.com/coqui-ai/TTS) | High quality, supports speaker cloning too                                                              |
| **Subtitle Handling**         | `ffmpeg`, `srt`, `autosub`, or custom logic                                                           | SRT file generation and muxing                                                                          |
| **Muxing**                    | `ffmpeg`                                                                                              | Add subtitles or TTS audio back to the video                                                            |



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[repo]: https://github.com/othneildrew/open-whisperer 
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[ffmpeg]: https://img.shields.io/badge/ffmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white
[openai]: https://img.shields.io/badge/OpenAI%20Whisper-412991?style=for-the-badge&logo=openai&logoColor=white
[argos]: https://img.shields.io/badge/argostranslate-1565C0?style=for-the-badge&logo=LibreTranslate&logoColor=white
[Next-url]: https://nextjs.org/
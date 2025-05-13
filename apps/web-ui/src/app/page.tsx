'use client';

import { FormEvent, useCallback, useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);



    for (const [key, value] of formData.entries()) {
      console.log('key:::', key);
      console.log('value:::', value);
    }

    console.log('formData:::', formData.entries())
    const files = form.files;

    // if (files.length !== 1) {
    //   // throw error a file must be specified, no more than 1
    // }



    console.log('files:::', { e, files });

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    .then(res => res.json())
    .then(data => {
      console.log('server response:::', data);
    })
      .catch(err => console.log(err));


  }

  const handleFileChange = () => {

  }

  const handleTranscribe = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch('/api/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: 'a_test.mp3',
        sourceLang:'es-US',
        targetLang: 'en-US',
      })
    });

    const data = await res.json();

    console.log('server response:::', data);

    setIsLoading(false);
  }, []);


  return (
    <div className="flex items-center justify-items-center h-screen">
      <main className="container mx-auto border-1">



        <div>
          <form className="" onSubmit={handleSubmit}>
            <input name="sourceLang" defaultValue="es" hidden />
            <input name="targetLang" defaultValue="en" hidden />
            <input name="file" type="file" id="file" onChange={handleFileChange} accept="video/*,audio/*" />
            <button type="submit">Upload</button>
          </form>
        </div>

        <div>
          <button onClick={handleTranscribe} disabled={isLoading}>Transcribe </button>
          {isLoading && <p className="text-amber-500">Transcribing...</p>}
        </div>




      </main>


    </div>
  );
}

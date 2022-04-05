import requests


def milliseconds_to_hours(millis):
    millis = int(millis)
    seconds = (millis / 1000) % 60
    seconds = int(seconds)
    minutes = millis / (1000 * 60)
    minutes = int(minutes)
    return f'{minutes}:{seconds}'


headers = {
    'authorization': '37ec4aafce34441eb718fcf6ad948922',
    'content-type': 'application/json',
}


def upload_to_AssemblyAi(file_url):

    transcript_endpoint = 'https://api.assemblyai.com/v2/transcript'
    upload_endpoint = 'https://api.assemblyai.com/v2/upload'

    print('Uploading')

    upload_response = requests.post(
        upload_endpoint, headers=headers, data=audio_file
    )

    audio_url = upload_response.json()['upload_url']
    print('done')

    json = {
        'audio_url': audio_url,
    }

    response = requests.post(transcript_endpoint, json=json, headers=headers)
    print(response.json())
    polling_endpoint = transcript_endpoint + '/' + response.json()['id']
    return polling_endpoint

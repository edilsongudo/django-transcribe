function upload_to_assemblyAi(audio_file) {

    const transcript_endpoint = 'https://api.assemblyai.com/v2/transcript'
    const upload_endpoint = 'https://api.assemblyai.com/v2/upload'
    const headers = {
        'authorization': '37ec4aafce34441eb718fcf6ad948922',
        'content-type': 'application/json'
    }

    $.ajax({
        url: upload_endpoint,
        headers: headers,
        type: 'POST',
        enctype: 'multipart/form-data',
        data: audio_file,
        success: function(response) {
            let audio_url = response['upload_url']
            print(audio_url)
        }
    });    


}

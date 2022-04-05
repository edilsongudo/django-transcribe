const uploadForm = document.getElementById('upload-form')
const uploadBtn = document.getElementById('upload-file')
const progress = document.querySelector('.progress')
const progressBox = document.querySelector('.progress-done');
const cancelBox = document.getElementById('cancel-box')
const cancelBtn = document.getElementById('cancel-btn')

const statusContainer = document.querySelector('.status-container')
const transcriptionStatus = document.querySelector('.transcription-status')
const statusFilename = document.querySelector('.status-filename')
const transcriptionDownloadLink = document.querySelector('.download-link')

const csrf = document.getElementsByName('csrfmiddlewaretoken')

const upload_endpoint = '/upload/'

const file_exts = [
    '.mp3',
    ]

uploadBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    let input = document.getElementById('id_file')
    console.log(input)

    const file_data = input.files[0]

    if (!file_data) {
        swal('No file choosen')
        uploadForm.reset()
        return;
    }

    const name = file_data.name;
    statusFilename.innerText = file_data.name
    const lastDot = name.lastIndexOf('.');
    const fileName = name.substring(0, lastDot);
    const ext = '.' + name.substring(lastDot + 1);
    if (!file_exts.includes(ext)) {
        swal(`The file extension is not supoorted. Supported extensions: ${file_exts}`)
        uploadForm.reset()
        return;
    }

    progress.classList.remove('not-visible')
    progressBox.style.opacity = 1;
    cancelBox.classList.remove('not-visible')
    uploadBtn.classList.add('not-visible')
    transcriptionDownloadLink.classList.add('not-visible')
    transcriptionStatus.innerHTML = '<b>Status:</b> Uploading...'
    const url = URL.createObjectURL(file_data)
    console.log(file_data)

    const fd = new FormData()
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append('file', file_data)

    $.ajax({
        type:'POST',
        url: upload_endpoint,
        headers: {'content-type': 'application/json'},
        // url: uploadForm.action,
        enctype: 'multipart/form-data',
        data: fd,
        beforeSend: function(){
            console.log('before')
        },
        xhr: function(){
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener('progress', e=>{
                // console.log(e)
                if (e.lengthComputable) {
                    const percent = e.loaded / e.total * 100
                    console.log(percent)
                    progressBox.style.width = `${Math.trunc(percent)}` + '%';
                    progressBox.innerText = `${Math.trunc(percent)}` + '%';
                }

            })
            cancelBtn.addEventListener('click', ()=>{
                xhr.abort()
                setTimeout(()=>{
                    uploadForm.reset()
                    progressBox.style.width = 0
                    progress.classList.add('not-visible')
                    cancelBox.classList.add('not-visible')
                    uploadBtn.classList.remove('not-visible')
                }, 2000)
            })
            return xhr
        },
        success: function(response){
            cancelBox.classList.add('not-visible')
            progress.classList.add('not-visible')
            uploadBtn.classList.remove('not-visible')
            uploadForm.reset()
            progressBox.style.width = 0

            statusContainer.classList.remove('not-visible')
            transcriptionStatus.innerHTML = '<b>Status:</b> Transcribing...'

            let task_id = response['task_id']
            let assembly = axios.create({});

            pollResults = function() {
                assembly.get(`/results/${task_id}`)
                    .then((res) => {
                        console.log(res.data)
                        if (res.data.status === 'SUCCESS') {
                            transcriptionStatus.innerHTML = '<b>Status:</b> Ready to download.'
                            transcriptionDownloadLink.href = res.data.transcription_url
                            transcriptionDownloadLink.classList.remove('not-visible')
                            clearInterval(t)
                        }
                        if (res.data.status === 'FAILURE') {
                            transcriptionStatus.innerHTML = '<b>Status:</b>Transcription failed :('
                            clearInterval(t)
                        }
                    }).catch((err) => console.error(err));
            }

            t = setInterval(pollResults, 10000)
        },
        error: function(error){
            swal('ups... an error ocurred while uploading your file')
        },
        cache: false,
        contentType: false,
        processData: false,
    })

})

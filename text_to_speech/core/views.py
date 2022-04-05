import base64

from celery.result import AsyncResult
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .forms import UploadForm
from .tasks import transcribe


@csrf_exempt
def home(request):
    form = UploadForm(request.POST or None, request.FILES or None)
    return render(request, 'core/home.html', {'form': form})


@csrf_exempt
def upload(request):
    if request.method == 'POST':
        file = base64.b64encode(request.body)
        file = file.decode()
        res = transcribe.delay(file)
        return JsonResponse({'task_id': str(res.id)})


@csrf_exempt
def results(request, task_id):
    res = AsyncResult(task_id)
    if res.state == 'SUCCESS':
        return JsonResponse(
            {'transcription_url': res.get(), 'status': 'SUCCESS'}
        )
    if res.state in ('FAILURE', 'REVOKED'):
        return JsonResponse({'status': 'FAILURE'})
    return JsonResponse({'status': res.state})

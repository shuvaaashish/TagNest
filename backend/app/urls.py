from django.urls import path, re_path
from .views import( RegisterView, LoginView, DatasetListView,   SubmissionListCreateView, DashboardView)

urlpatterns = [
    re_path(r'^auth/register/?$', RegisterView.as_view(), name='register'),
    re_path(r'^auth/login/?$', LoginView.as_view(), name='login'),
    re_path(r'^datasets/?$', DatasetListView.as_view(), name='dataset-list'),
    re_path(r'^submissions/?$', SubmissionListCreateView.as_view(), name='submission-list-create'),
    re_path(r'^dashboard/?$', DashboardView.as_view(), name='dashboard'),
]
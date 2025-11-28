from django.urls import path
from .views import( RegisterView, LoginView, DatasetListView,   SubmissionListCreateView, DashboardView)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('datasets/', DatasetListView.as_view(), name='dataset-list'),
    path('submissions/', SubmissionListCreateView.as_view(), name='submission-list-create'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
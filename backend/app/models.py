from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Dataset(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
    
class Label(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='labels')
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.dataset.name} - {self.name}"
    
class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE)
    label = models.ForeignKey(Label, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="submissions/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.dataset.name} - {self.label.name}"


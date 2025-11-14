from django.db import models
from django.contrib.auth.models import User
import json

class Dataset(models.Model):
    name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    file_path = models.CharField(max_length=500)
    summary_stats = models.TextField()  # JSON string
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def get_summary_stats(self):
        return json.loads(self.summary_stats) if self.summary_stats else {}
    
    def set_summary_stats(self, stats_dict):
        self.summary_stats = json.dumps(stats_dict)

class Equipment(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name='equipment')
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    flowrate = models.FloatField()
    pressure = models.FloatField()
    temperature = models.FloatField()
    
    def __str__(self):
        return f"{self.name} ({self.type})"
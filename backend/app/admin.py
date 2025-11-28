from django.contrib import admin
from .models import Dataset, Label, Submission
from django.utils.html import format_html

# Register your models here.
@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)

@admin.register(Label)
class LabelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'dataset')
    list_filter = ('dataset',)
    search_fields = ('name', 'dataset__name')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'dataset', 'label','image_tag','created_at')
    list_filter = ('dataset', 'label', 'created_at')
    search_fields = ('user__username', 'dataset__name', 'label__name')

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="100" />'.format(obj.image.url))
        return "-"
    image_tag.short_description = 'Image'


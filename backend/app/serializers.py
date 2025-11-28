from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Dataset, Label, Submission

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"],
        )
        return user


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ["id", "name"]


class DatasetSerializer(serializers.ModelSerializer):
    labels = LabelSerializer(many=True, read_only=True)

    class Meta:
        model = Dataset
        fields = ["id", "name", "description", "labels"]


class SubmissionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    dataset = serializers.PrimaryKeyRelatedField(queryset=Dataset.objects.all())
    label = serializers.PrimaryKeyRelatedField(queryset=Label.objects.all())

    class Meta:
        model = Submission
        fields = ["id", "user", "dataset", "label", "image", "created_at"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

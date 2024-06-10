from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

""" 
This is going to map my python objects onto JSON code that the database will understand and vice versa.
I'm going to create a new user here
I need to have a set of credentials (Username and password) in order to grant an access token.

The User model is built into Django and I'm importing it above'
django.contrib.auth¶
 """

class UserSerializer(serializers.ModelSerializer):
    class Meta:   
        model = User
        fields = ["id", "username", "password"]
#  I want to send the password to the database, but I don't want to return the password.
        extra_kwargs = {"password": {"write_only": True}}

#  This function will create a new user.
    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
# I don't want people to change the name of an author
        extra_kwargs = {"author": {"read_only": True}}
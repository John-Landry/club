from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

#  I'm gonna use generic views they want three things a serialize, a class, a permissions class, and a query set.
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
# You have to pass the token to get through here
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
#If I want to get all users:
#       return Note.objects.all()
# This way you only see your own notes and can't see other peoples.
        return Note.objects.filter(author=user)

# This will override the create method that I made in serializes pie
    def perform_create(self, serializer):
        if serializer.is_valid():
# This unblocks the authors name
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

#  I'm gonna make it so you can only delete your own notes
class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

# I'm gonna make a class based view that will let me make new users
# Similar to a registration form

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
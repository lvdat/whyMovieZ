<template>
    <div class="container mx-auto p-4 h-screen flex flex-col">
      <h1 class="text-2xl font-bold mb-4 dark:text-white">AI Chat</h1>
      <div class="flex-1 overflow-y-auto mb-4">
        <div v-for="(message, index) in messages" :key="index" class="mb-4">
          <div v-if="message.role === 'user'" class="flex justify-end">
            <div class="bg-blue-500 text-white p-3 rounded-lg max-w-[70%]">
              {{ message.content }}
            </div>
          </div>
          <div v-else class="flex justify-start">
            <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg max-w-[70%]">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Nhập tin nhắn..."
          class="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
        />
        <button @click="sendMessage" class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Gửi
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const inputMessage = ref('');
  const messages = ref([]);
  
  const sendMessage = async () => {
    if (!inputMessage.value.trim()) return;
  
    // Thêm tin nhắn của người dùng vào danh sách
    messages.value.push({ role: 'user', content: inputMessage.value });
  
    // Gửi tin nhắn đến API
    const userMessage = inputMessage.value;
    inputMessage.value = ''; // Xóa input sau khi gửi
  
    try {
      const response = await axios.post(
        'https://api.aimlapi.com/chat/completions',
        {
          model: 'gpt-4o', // Hoặc model bạn muốn sử dụng
          messages: [{ role: 'user', content: userMessage }],
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_AIMLAPI_KEY}`, // Thay YOUR_AIMLAPI_KEY bằng key của bạn
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Thêm phản hồi từ AI vào danh sách
      messages.value.push({ role: 'assistant', content: response.data.choices[0].message.content });
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      messages.value.push({ role: 'assistant', content: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
    }
  };
  </script>
  
  <style>
  /* Tùy chỉnh giao diện */
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
  </style>
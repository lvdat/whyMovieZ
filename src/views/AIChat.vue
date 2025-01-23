<template>
    <div class="container mx-auto p-4 h-screen flex flex-col">
      <h1 class="text-2xl font-bold mb-4 dark:text-white">AI Chat</h1>
      <div class="flex-1 overflow-y-auto mb-4">
        <div v-for="(message, index) in messages" :key="index" class="mb-4">
          <div v-if="message.role === 'user'" class="flex justify-end">
            <div class="bg-blue-500 text-white p-3 rounded-lg max-w-[70%]">
              <div v-html="renderMarkdown(message.content)" class="prose"></div>
            </div>
          </div>
          <div v-else class="flex justify-start">
            <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg max-w-[70%]">
              <div v-html="renderMarkdown(message.content)" class="prose"></div>
            </div>
          </div>
        </div>
        <!-- Hiển thị tin nhắn đang được stream -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg max-w-[70%]">
            <div v-html="renderMarkdown(streamedText)" class="prose"></div>
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
  import { marked } from 'marked';
  
  const inputMessage = ref('');
  const messages = ref([]);
  const isTyping = ref(false); // Trạng thái AI đang nhập
  const streamedText = ref(''); // Nội dung đang được stream
  
  // Hàm chuyển đổi Markdown thành HTML
  const renderMarkdown = (text) => {
    return marked(text);
  };
  
  const sendMessage = async () => {
    if (!inputMessage.value.trim()) return;
  
    // Thêm tin nhắn của người dùng vào danh sách
    messages.value.push({ role: 'user', content: inputMessage.value });
  
    // Gửi tin nhắn đến API
    const userMessage = inputMessage.value;
    inputMessage.value = ''; // Xóa input sau khi gửi
  
    isTyping.value = true; // Bắt đầu hiển thị trạng thái "AI đang nhập..."
    streamedText.value = ''; // Reset nội dung stream
  
    try {
      const response = await fetch('https://api.aimlapi.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_AIMLAPI_KEY}`, // Thay YOUR_DEEPSEEK_API_KEY bằng key của bạn
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // Model bạn muốn sử dụng
          messages: [{ role: 'user', content: userMessage }],
          stream: true, // Bật chế độ stream
        }),
      });
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        // Giải mã dữ liệu nhận được
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
  
        for (const line of lines) {
          if (line.trim() === '') continue;
  
          try {
            const json = JSON.parse(line.replace('data: ', ''));
            const content = json.choices[0].delta.content;
  
            if (content) {
              streamedText.value += content; // Thêm từng ký tự vào nội dung stream
            }
          } catch (error) {
            console.error('Lỗi khi phân tích dữ liệu:', error);
          }
        }
      }
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      messages.value.push({ role: 'assistant', content: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' });
    } finally {
      isTyping.value = false; // Tắt trạng thái "AI đang nhập..."
  
      // Thêm nội dung đã stream vào danh sách tin nhắn
      if (streamedText.value) {
        messages.value.push({ role: 'assistant', content: streamedText.value });
        streamedText.value = ''; // Reset nội dung stream
      }
    }
  };
  </script>
  
  <style>
  /* Animation "AI đang nhập..." */
  .dot-flashing {
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #6b7280;
    color: #6b7280;
    animation: dot-flashing 1s infinite linear alternate;
    animation-delay: 0.5s;
  }
  .dot-flashing::before, .dot-flashing::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
  }
  .dot-flashing::before {
    left: -15px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #6b7280;
    color: #6b7280;
    animation: dot-flashing 1s infinite alternate;
    animation-delay: 0s;
  }
  .dot-flashing::after {
    left: 15px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #6b7280;
    color: #6b7280;
    animation: dot-flashing 1s infinite alternate;
    animation-delay: 1s;
  }
  @keyframes dot-flashing {
    0% {
      background-color: #6b7280;
    }
    50%, 100% {
      background-color: rgba(107, 114, 128, 0.2);
    }
  }
  
  /* Tùy chỉnh giao diện Markdown */
  .prose {
    max-width: 100%;
    word-wrap: break-word;
  }
  .prose h1, .prose h2, .prose h3 {
    margin-top: 1em;
    margin-bottom: 0.5em;
  }
  .prose p {
    margin-bottom: 1em;
  }
  .prose code {
    background-color: rgba(107, 114, 128, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 4px;
  }
  .prose pre {
    background-color: rgba(107, 114, 128, 0.1);
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
  }
  </style>
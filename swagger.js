const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Meta API',
    version: "1.0.0",
    description: '示範範例生成文件',
  },
  host: process.env.PORT || 'localhost:3005', // 上傳記得改 看是打哪個API 例如 herpku
  schemes: ['http', 'https'], // 支援哪幾種模式
  securityDefinitions: { // 帶驗證 要補
    apiKeyAuth: {
      type: 'apiKey',
      in: 'headers',
      name: 'authorization',
      description: '請加上 API Token'
    }
  }
};

const outputFile = './swagger-output.json'; 
const endpointsFiles = ['./app.js']; // 查詢進入點

swaggerAutogen(outputFile, endpointsFiles, doc); // 輸出檔案名/讀取檔案/格式
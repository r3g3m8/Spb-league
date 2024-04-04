import { readFileSync, writeFileSync } from 'fs';
import Docxtemplater from 'docxtemplater';

interface News {
    id: number;
    title: string;
    content: string | null;
    publish_date: string | null;
    image: string;
    authorId: number | null;
}

export const generateWordDocument = (news: News[], outputPath: string) => {
  // Читаем содержимое шаблона Word-документа
  const templateContent = readFileSync('@/docs/template.docx', 'binary');

  // Создаем экземпляр Docxtemplater с шаблоном
  const doc = new Docxtemplater();
  doc.loadZip(templateContent);

  // Подставляем данные в шаблон
  doc.setData({ news });

  try {
    // Рендерим документ
    doc.render();
    // Получаем бинарные данные документа
    const output = doc.getZip().generate({ type: 'nodebuffer' });
    // Записываем документ в файл
    writeFileSync(outputPath, output);
    console.log('Word document generated successfully!');
  } catch (error) {
    console.error('Failed to generate Word document:', error);
  }
};
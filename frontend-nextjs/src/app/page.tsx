import { redirect } from 'next/navigation';

export default function Home() {
  // 預設重定向到軟體開發頁面
  redirect('/dev');
}

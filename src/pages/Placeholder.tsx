export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6 gap-2">
      <h1 className="font-extrabold text-ink text-lg">{title}</h1>
      <p className="text-muted text-sm">هذه الصفحة قيد الإنشاء — سيتم استكمالها في المرحلة القادمة.</p>
    </div>
  )
}

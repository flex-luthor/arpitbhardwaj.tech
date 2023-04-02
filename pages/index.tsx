import Editor from "@/components/Editor";

export default function Home() {
  return (
    <div className="flex flex-col items-center py-20 px-8 md:px-20">
      <div className="bg-gray-900/50 text-white w-full max-w-[800px] p-8 rounded-xl">
        <Editor />
      </div>
    </div>
  );
}

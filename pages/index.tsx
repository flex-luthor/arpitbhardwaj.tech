import Editor from "@/components/Editor";

export default function Home() {
  return (
    <div className="flex flex-col items-center py-20 px-8 md:px-20">
      <div className="bg-gray-900/50 text-white w-full max-w-[800px] p-8 rounded-xl">
        <Editor />
      </div>
      <div className="bg-gray-900/50 text-white w-full max-w-[800px] p-8 rounded-xl mt-8">
        <div className="mb-8 text-4xl font-bold text-center text-blue-500/80">
          🚧 Portfolio Under Construction 🚨
        </div>
        <div className="grid grid-cols-2">
          <a
            href="https://drive.google.com/file/d/1x9p2KAvtMcHmPCq-pL0oADeidFA-JCVc/view?usp=sharing"
            className="text-blue-500 text-xl font-semibold p-4 m-2 border border-blue-500 rounded-xl flex justify-center hover:bg-blue-500/20"
          >
            📄 My Resume ⇾
          </a>
          <a
            href="https://www.linkedin.com/in/arpitbhardwajreact/"
            className="text-blue-500 text-xl font-semibold p-4 m-2 border border-blue-500 rounded-xl flex justify-center hover:bg-blue-500/20"
          >
            🖇️ LinkedIn ⇾
          </a>
          <a
            href="https://twitter.com/ArpitBh30818912"
            className="text-blue-500 text-xl font-semibold p-4 m-2 border border-blue-500 rounded-xl flex justify-center hover:bg-blue-500/20"
          >
            🐦 Twitter ⇾
          </a>
          <a
            href="https://github.com/flex-luthor"
            className="text-blue-500 text-xl font-semibold p-4 m-2 border border-blue-500 rounded-xl flex justify-center hover:bg-blue-500/20"
          >
            👨‍💻 Github ⇾
          </a>
        </div>
      </div>
    </div>
  );
}

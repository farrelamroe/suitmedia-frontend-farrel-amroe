import Image from "next/image";

type Idea = {
  id: number;
  published_at: string;
  title: string;
  small_image: string;
  medium_image: string;
};

type Props = {
  ideas?: Idea[]; // Use optional chaining to handle undefined
};

const CardContent: React.FC<Props> = ({ ideas }: any) => {
  return (
    <div className="lg:flex lg:flex-wrap lg:flex-row gap-5 justify-center p-[64px] grid grid-cols-1 sm:grid-cols-2">
      {ideas.map((idea: any) => (
        <div key={idea.id} className="lg:max-w-[20%] h-72 shadow-md rounded-[8px] sm:max-w-[200px]">
          <Image
            src={idea.small_image[0].url || idea.medium_image[0].url}
            alt="content"
            width={400}
            height={200}
            className="w-full object-cover aspect-video rounded-t-[8px]"
          />
          <p className="text-[14px] px-[8px] pt-[8px]">{idea.published_at}</p>
          <h1 className="text-lg font-bold overflow-hidden line-clamp-3 px-[8px]">
            {idea.title}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default CardContent;

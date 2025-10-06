import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

export const RecommendationsCarousel = ({ recommendations }: any) => {
  const category = {
    generalPopulation: "General Population",
    lungDiseasePopulation: "People with Lung Diseases",
    heartDiseasePopulation: "People with Heart Diseases",
    athletes: "Athletes",
    children: "Children",
    elderly: "Elderly People",
    pregnantWomen: "Pregnant Women",
  };

  const imagesCategory = {
    generalPopulation: "/people.jpg",
    lungDiseasePopulation: "/respiratorio.jpg",
    heartDiseasePopulation: "/heart.jpg",
    children: "/children.jpg",
    elderly: "/olderadult.jpg",
    pregnantWomen: "/pregnan.jpg",
    athletes: "/athletes.jpg",
  };

  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent>
        {recommendations.map((item: any, index: number) => (
          <CarouselItem key={item.id}>
            <div className="border rounded-lg relative  overflow-hidden ">
              <Image
                src={imagesCategory[item.type as keyof typeof imagesCategory]}
                alt={item.type}
                className="w-full h-full  object-cover aspect-square"
                width={300}
                height={300}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/100 via-black/80 to-transparent text-white p-4">
                <h3 className="text-lg font-bold mb-2">
                  {category[item.type as keyof typeof category]}
                </h3>
                <p className="text-sm text-[f5f5f5] leading-relaxed">
                  {item.recommendation}
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

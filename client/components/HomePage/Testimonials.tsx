import React from 'react';

const testimonials = [
  { name: "Briar Martin", handle: "@briarwrites", text: "Radiant made undercutting all of our competitors an absolute breeze.", src: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D' },
  { name: "Avery Johnson", handle: "@averywrites", text: "The ATS scoring is pinpoint accurate. Helped me land my first dev role!", src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D' },
  { name: "Jordan Lee", handle: "@jordanleex", text: "The live job matching is a game changer for my job search.", src: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
  { name: "Sam Smith", handle: "@samsmith", text: "CareerSync is easily the best tool I've used this year for my career.", src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' },
];

const TestimonialCard = ({ name, handle, text, src }: any) => (
  <div className="flex flex-col p-8 bg-white border border-slate-100 rounded-3xl shadow-sm min-w-[340px] mx-4 shrink-0 
                  transition-all duration-500 ease-out
                  hover:shadow-2xl hover:border-blue-200 hover:-translate-y-2 group cursor-pointer">
    <div className="flex items-center gap-4 mb-5">
      <div  /> 
      <img src={src} alt="" className="w-12 h-12 rounded-full  group-hover:bg-blue-50 transition-colors" />
      <div>
        <h4 className="font-bold text-slate-900 text-[15px]">{name}</h4>
        <p className="text-xs text-slate-400 font-medium tracking-wide">{handle}</p>
      </div>
    </div>
    <p className="text-slate-500 text-[15px] leading-relaxed italic group-hover:text-slate-700 transition-colors">
      "{text}"
    </p>
  </div>
);

export default function Testimonials() {
  const list = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-24 bg-[#F8FAFC] overflow-hidden border-y border-slate-100 relative">
      {/* Updated Header Section */}
      <div className="container mx-auto px-6 text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-medium text-gray-700 tracking-tight">
          Don't just take our words
        </h2>
        <p className="mt-6 text-md text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Hear what our users say about us. We're always looking for ways to improve. 
          If you have a positive experience with us, leave a review.
        </p>
      </div>

      <div className="relative flex flex-col gap-10">
        {/* Row 1 */}
        <div className="flex animate-marquee pause-on-hover w-max ">
          {list.map((t, i) => (
            <TestimonialCard key={`r1-${i}`} {...t}  />
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex animate-marquee-reverse pause-on-hover w-max">
          {list.map((t, i) => (
            <TestimonialCard key={`r2-${i}`} {...t} />
          ))}
        </div>

        {/* Soft edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10" />
      </div>
    </section>
  );
}
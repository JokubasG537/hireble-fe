import React, { useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import compImg1 from "../assets/companies/pngwing.com (1).png";
import compImg2 from "../assets/companies/pngwing.com (2).png";
import compImg3 from "../assets/companies/pngwing.com (3).png";
import compImg4 from "../assets/companies/pngwing.com (4).png";
import compImg5 from "../assets/companies/pngwing.com.png";

import "swiper/css";

// import "./styles.css";

export default function SwiperDecoration() {
  const images = [compImg1, compImg2, compImg3, compImg4, compImg5];

  return (
    <Swiper
      className="mySwiper"
      spaceBetween={20}
      slidesPerView={3}
      loop={true}
      autoplay={{ delay: 2500 }}
    >
      {images.map((imgSrc, index) => (
        <SwiperSlide key={index}>
          <img src={imgSrc} alt={`company-${index}`} style={{ width: "100%" }} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
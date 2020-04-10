export const Loading = () => (
  <svg
    className="container"
    viewBox="0 0 580 460"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <g id="component-foot" transform-origin="30 20">
        <path d="M0 24C-1 9 8 1 31 0c37 5 28 38 28 57s-8 38-13 51H17C3 98 2 38 0 24z" />
      </g>
      <g id="component-deno">
        <g transform="translate(90, 330)">
          <ellipse
            cx="120.5"
            cy="17.5"
            rx="120.5"
            ry="17.5"
            fill="#DBCCB6"
            fillOpacity="0.30"
          />
        </g>
        <g className="jump">
          <g transform="translate(240, 240)">
            <use
              className="foot foot-1"
              xlinkHref="#component-foot"
              fill="#7a885d"
            ></use>
          </g>
          <g transform="translate(110, 240)">
            <use
              className="foot foot-2"
              xlinkHref="#component-foot"
              fill="#7a885d"
            ></use>
          </g>

          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M68 87l-10 1C26 88 0 68 0 44S26 0 58 0s58 19 58 43c6 23 14 55 23 83 3 10 8 20 13 29l7 14c10 9 23 11 59 11 58 0 106 30 113 69 3 8 7 19 10 33 10 43 28 64 39 66-17 0-27-9-40-22l-2-2c-8-8-15-18-20-27-19 25-57 42-100 42-63 0-114-36-114-79v-34l-4-37-1-1A1890 1890 0 0168 87z"
            fill="#A4DD90"
          />
          <circle cx="71" cy="28" r="6" fill="#000" />
          <g transform="translate(120, 250)">
            <use
              className="foot foot-3"
              xlinkHref="#component-foot"
              fill="#A4DD90"
            ></use>
          </g>
          <g transform="translate(260, 250)">
            <use
              className="foot foot-4"
              xlinkHref="#component-foot"
              fill="#A4DD90"
            ></use>
          </g>
        </g>
      </g>
    </defs>

    <g transform="translate(300,150) scale(0.5)">
      <g className="move move-child">
        <use xlinkHref="#component-deno"></use>
      </g>
    </g>
    <g transform="translate(20,50) scale(0.8)">
      <g className="move">
        <use xlinkHref="#component-deno"></use>
      </g>
    </g>

    <g transform="translate(170,390) scale(1)">
      <path
        className="loading-letter loading-letter-0"
        d="M2.3 25.5c-.7 0-1.2-.2-1.7-.7-.4-.4-.6-1-.6-1.6V1.8C0 1.4.2 1 .5.7.8.3 1.2.2 1.6.2c.5 0 .9.1 1.2.5.3.3.5.7.5 1.1v20.4H15c.5 0 .9.2 1.2.5.3.3.5.7.5 1.2 0 .4-.2.8-.5 1.1-.3.3-.7.5-1.2.5H2.3z"
        fill="#8B8B8B"
      />
      <path
        className="loading-letter loading-letter-1"
        d="M44.6 25.8a13 13 0 01-6.6-1.6 11.3 11.3 0 01-4.4-4.6 14.7 14.7 0 010-13.4c1-2 2.5-3.4 4.4-4.5A13 13 0 0144.6 0c2.6 0 4.8.6 6.6 1.7 2 1 3.4 2.6 4.4 4.6a14.3 14.3 0 010 13.3c-1 2-2.5 3.5-4.4 4.6-1.8 1.1-4 1.6-6.6 1.6zm0-3c2 0 3.6-.4 5-1.3 1.5-.9 2.5-2 3.3-3.5.7-1.5 1.1-3.2 1.1-5 0-2-.4-3.6-1.1-5.1a8.5 8.5 0 00-3.2-3.5c-1.5-1-3.1-1.3-5-1.3a8.6 8.6 0 00-8.2 4.8c-.8 1.5-1.2 3.2-1.2 5 0 1.9.4 3.6 1.1 5a8.6 8.6 0 008.2 4.9z"
        fill="#8B8B8B"
      />
      <path
        className="loading-letter loading-letter-2"
        d="M75 25.7c-.6 0-1-.2-1.3-.5a1.6 1.6 0 01-.2-1.9l9.2-21.6c.1-.5.4-.8.7-1a2 2 0 011.3-.5h.4c.5 0 1 .1 1.3.4l.8 1 9.2 21.7.2.7c0 .5-.2.9-.5 1.2-.3.3-.7.5-1.2.5l-.9-.3c-.3-.2-.5-.4-.6-.7L91 19H78.8l-2.3 5.7-.7.7c-.2.2-.5.3-.9.3zm5-9.6h9.8L84.9 4.4 80.1 16z"
        fill="#8B8B8B"
      />
      <path
        className="loading-letter loading-letter-3"
        d="M116.2 25.5c-.4 0-.8-.2-1.1-.5-.3-.3-.5-.7-.5-1.1V2c0-.4.2-.8.5-1.1.3-.4.7-.5 1.1-.5h7.3c2.7 0 5 .6 7 1.8 1.9 1.2 3.3 2.8 4.3 4.7a13.4 13.4 0 010 12 11.8 11.8 0 01-11.3 6.6h-7.3zm6.9-3c2 0 3.7-.5 5.2-1.3s2.6-1.9 3.4-3.3a9.9 9.9 0 001.3-5c0-1.8-.5-3.5-1.3-5-.8-1.3-2-2.5-3.4-3.3-1.5-.8-3.2-1.2-5.2-1.2h-5.2v19h5.2z"
        fill="#8B8B8B"
      />
      <path
        className="loading-letter loading-letter-4"
        d="M156 25.7c-.4 0-.8-.2-1-.5-.4-.3-.6-.7-.6-1.2V1.8c0-.4.2-.8.5-1.1.3-.4.7-.5 1.2-.5.4 0 .8.1 1.1.5.4.3.5.7.5 1.1V24c0 .5-.1.9-.5 1.2-.3.3-.7.5-1.1.5z"
        fill="#8B8B8B"
      />
      <path
        className="loading-letter loading-letter-5"
        d="M179.1 25.7c-.4 0-.8-.2-1.1-.5-.4-.3-.5-.7-.5-1.2V2.6c0-.7.2-1.2.7-1.7.4-.5 1-.7 1.6-.7h.5c.8 0 1.4.3 2 1l13.8 20V1.9c0-.4.2-.8.5-1.1.3-.4.7-.5 1.2-.5.4 0 .8.1 1.1.5.3.3.5.7.5 1.1v21.5c0 .7-.2 1.2-.7 1.7-.5.4-1 .7-1.7.7h-.4c-.4 0-.7-.1-1-.3-.4-.2-.7-.4-.9-.7l-14-20.1V24c0 .5-.1.9-.4 1.2-.4.3-.7.5-1.2.5z"
        fill="#8B8B8B"
      />
      <path
        className="loading-letter loading-letter-6"
        d="M230.3 25.8c-2.5 0-4.7-.5-6.6-1.6-2-1-3.4-2.6-4.5-4.5a14 14 0 01-1.5-6.7c0-2.6.5-4.8 1.6-6.8s2.6-3.5 4.5-4.6c2-1 4-1.6 6.4-1.6a15.8 15.8 0 019 2.6l.5.5a1.5 1.5 0 01-.3 1.8c-.2.3-.6.5-1 .5l-.8-.2a12.8 12.8 0 00-7-2c-1.9 0-3.5.4-5 1.1a8.4 8.4 0 00-3.4 3.4c-.9 1.5-1.3 3.2-1.3 5.3 0 1.8.4 3.5 1.2 5a9 9 0 003.4 3.5c1.5.8 3.2 1.3 5.2 1.3a13 13 0 006.3-1.6v-6.5h-6c-.3 0-.7-.2-1-.5-.2-.3-.4-.6-.4-1s.2-.8.4-1c.3-.4.7-.5 1-.5h7.2c.5 0 .9.2 1.2.5.3.3.5.7.5 1.2v8.2a2.5 2.5 0 01-1.4 2.2c-2.7 1.4-5.4 2-8.2 2z"
        fill="#8B8B8B"
      />
    </g>
    <style jsx>{`
      svg.container {
        max-width: 400px;
      }
      @keyframes sin-rotate {
        0% {
          transform-origin: 30 20;
          transform: rotate(-7deg);
        }
        100% {
          transform-origin: 30 20;
          transform: rotate(7deg);
        }
      }
      @keyframes jump-sin {
        0% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(0px, -10px);
        }
        100% {
          transform: translate(0, 0);
        }
      }
      @keyframes move-sin {
        0% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(40px, 0px);
        }
      }
      @keyframes text-jump {
        0% {
          transform: translate(0, 0);
        }
        20% {
          transform: translate(0px, -20px);
        }
        40% {
          transform: translate(0, 0);
        }
      }

      .jump {
        animation: jump-sin 0.4s alternate infinite ease-in-out;
      }
      .move {
        animation: move-sin 1.6s alternate infinite ease-in-out;
      }
      .move-child {
        animation-delay: 0.3s;
      }

      .foot {
        animation: sin-rotate 0.4s alternate infinite ease-in-out;
      }

      .foot-1 {
        animation-delay: 0.1s;
      }
      .foot-2 {
        animation-delay: -0.5s;
      }
      .foot-3 {
        animation-delay: -0s;
      }
      .foot-4 {
        animation-delay: -0.4s;
      }

      .loading-letter {
        animation: text-jump 2s normal infinite ease-in-out;
      }
      .loading-letter-0 {
        animation-delay: 0s;
      }
      .loading-letter-1 {
        animation-delay: 0.1s;
      }
      .loading-letter-2 {
        animation-delay: 0.2s;
      }
      .loading-letter-3 {
        animation-delay: 0.3s;
      }
      .loading-letter-4 {
        animation-delay: 0.4s;
      }
      .loading-letter-5 {
        animation-delay: 0.5s;
      }
      .loading-letter-6 {
        animation-delay: 0.6s;
      }
    `}</style>
  </svg>
);

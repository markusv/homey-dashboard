export const ShuffleIcon = ({ fill, className }) => (
  <svg
    viewBox="0 0 26 20"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M21 1.869a1 1 0 0 1 .555.167l3.197 2.132a1 1 0 0 1 0 1.664l-3.197 2.132A1 1 0 0 1 20 7.13V6h-3.52l-3.2 4 3.2 4H20v-1.131a1 1 0 0 1 1.555-.833l3.197 2.132a1 1 0 0 1 0 1.664l-3.197 2.132A1 1 0 0 1 20 17.13V16h-4a1 1 0 0 1-.78-.375L12 11.6l-3.22 4.024A1 1 0 0 1 8 16H1a1 1 0 0 1 0-2h6.52l3.199-4-3.2-4H1a1 1 0 1 1 0-2h7a1 1 0 0 1 .78.375L12 8.4l3.22-4.024A1 1 0 0 1 16 4h4V2.869a1 1 0 0 1 1-1Z"
      fill={fill ?? "#FFF"}
    />
  </svg>
);

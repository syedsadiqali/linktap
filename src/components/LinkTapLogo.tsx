import React from "react";

export default function LinkTapLogo({className, style = {}}: {className?: string, style?: object}) {
  return (
    <svg
      width="94"
      height="25"
      viewBox="0 0 124 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M19.5428 4.77412C20.1316 5.31654 20.8358 5.58775 21.6553 5.58775C22.4828 5.58775 23.1869 5.31654 23.7678 4.77412C24.3566 4.22372 24.6509 3.56164 24.6509 2.78789C24.6509 2.02212 24.3566 1.36802 23.7678 0.8256C23.1869 0.2752 22.4828 0 21.6553 0C20.8358 0 20.1316 0.2752 19.5428 0.8256C18.954 1.36802 18.6597 2.02212 18.6597 2.78789C18.6597 3.56164 18.954 4.22372 19.5428 4.77412Z"
        fill="#78350F"
      />
      <path
        d="M0 26.1081V1.60333H5.90775V21.2981H16.0762V26.1081H0Z"
        fill="#F59E0B"
      />
      <path
        d="M18.7312 26.1081V7.72952H24.5674V26.1081H18.7312Z"
        fill="#F59E0B"
      />
      <path
        d="M33.7149 15.6265V26.1081H27.8788V7.72952H33.4285V11.1037H33.6314C34.0372 9.97897 34.7294 9.09754 35.708 8.45939C36.6867 7.81327 37.8523 7.49021 39.205 7.49021C40.4939 7.49021 41.6118 7.78136 42.5586 8.36367C43.5134 8.938 44.2534 9.74366 44.7785 10.7806C45.3116 11.8096 45.5742 13.0141 45.5662 14.3941V26.1081H39.7301V15.5428C39.738 14.5218 39.4795 13.7241 38.9543 13.1498C38.4371 12.5754 37.7171 12.2883 36.7941 12.2883C36.1815 12.2883 35.6404 12.4239 35.171 12.6951C34.7095 12.9583 34.3515 13.3372 34.0968 13.8318C33.8502 14.3263 33.7229 14.9246 33.7149 15.6265Z"
        fill="#F59E0B"
      />
      <path
        d="M54.0395 21.2861L54.0633 14.3104H54.8749L60.0307 7.72952H66.6427L58.9805 17.1581H57.4409L54.0395 21.2861ZM48.7762 26.1081V1.60333H54.6123V26.1081H48.7762ZM60.162 26.1081L55.3642 18.4743L59.2072 14.3223L66.9052 26.1081H60.162Z"
        fill="#F59E0B"
      />
      <path
        d="M65.6247 6.41334V1.60333H86.2839V6.41334H78.8724V26.1081H73.0482V6.41334H65.6247Z"
        fill="#F59E0B"
      />
      <path
        d="M91.4393 26.4192C90.2697 26.4192 89.2313 26.2237 88.3243 25.8329C87.4252 25.434 86.7131 24.8358 86.1879 24.0381C85.6708 23.2324 85.4122 22.2234 85.4122 21.0109C85.4122 19.9899 85.5912 19.1284 85.9492 18.4264C86.3073 17.7244 86.8006 17.1541 87.4292 16.7154C88.0577 16.2767 88.7818 15.9456 89.6013 15.7223C90.4208 15.4909 91.2961 15.3354 92.227 15.2556C93.2693 15.1599 94.1087 15.0602 94.7452 14.9565C95.3817 14.8448 95.8432 14.6893 96.1297 14.4899C96.4241 14.2825 96.5713 13.9913 96.5713 13.6164V13.5566C96.5713 12.9424 96.3604 12.4677 95.9387 12.1327C95.517 11.7977 94.9481 11.6302 94.232 11.6302C93.4602 11.6302 92.8396 11.7977 92.3702 12.1327C91.9007 12.4677 91.6024 12.9304 91.4751 13.5207L86.0925 13.3292C86.2516 12.2125 86.6614 11.2154 87.3217 10.3379C87.9901 9.4525 88.9051 8.75852 90.0668 8.25598C91.2364 7.74547 92.6407 7.49021 94.2798 7.49021C95.4494 7.49021 96.5275 7.62981 97.5141 7.90899C98.5007 8.1802 99.36 8.57904 100.092 9.10551C100.824 9.62401 101.389 10.2621 101.787 11.0199C102.193 11.7777 102.395 12.6432 102.395 13.6164V26.1081H96.9054V23.5475H96.7622C96.436 24.1697 96.0183 24.6962 95.5091 25.1269C95.0078 25.5577 94.415 25.8807 93.7308 26.0961C93.0544 26.3115 92.2906 26.4192 91.4393 26.4192ZM93.2414 22.5903C93.87 22.5903 94.4349 22.4627 94.9362 22.2074C95.4454 21.9522 95.8512 21.6012 96.1535 21.1545C96.4559 20.6998 96.6071 20.1733 96.6071 19.5751V17.8281C96.44 17.9159 96.2371 17.9957 95.9984 18.0674C95.7676 18.1392 95.513 18.207 95.2345 18.2709C94.9561 18.3347 94.6696 18.3905 94.3752 18.4384C94.0808 18.4862 93.7984 18.5301 93.5279 18.57C92.9789 18.6577 92.5094 18.7933 92.1196 18.9768C91.7376 19.1603 91.4432 19.3996 91.2364 19.6947C91.0375 19.9819 90.938 20.3249 90.938 20.7237C90.938 21.33 91.1528 21.7926 91.5825 22.1117C92.0201 22.4308 92.5731 22.5903 93.2414 22.5903Z"
        fill="#F59E0B"
      />
      <path
        d="M105.561 33V7.72952H111.337V10.8764H111.516C111.755 10.318 112.093 9.77955 112.531 9.26106C112.976 8.74257 113.541 8.3198 114.225 7.99275C114.918 7.65772 115.745 7.49021 116.708 7.49021C117.981 7.49021 119.17 7.82524 120.276 8.49529C121.39 9.16534 122.289 10.1983 122.974 11.5943C123.658 12.9902 124 14.769 124 16.9308C124 19.0127 123.67 20.7556 123.009 22.1595C122.357 23.5635 121.474 24.6164 120.36 25.3184C119.254 26.0203 118.025 26.3713 116.672 26.3713C115.749 26.3713 114.949 26.2197 114.273 25.9166C113.597 25.6135 113.028 25.2147 112.566 24.7201C112.113 24.2255 111.763 23.6951 111.516 23.1287H111.397V33H105.561ZM111.277 16.9188C111.277 17.9079 111.409 18.7694 111.671 19.5033C111.942 20.2371 112.328 20.8075 112.829 21.2143C113.338 21.6131 113.947 21.8126 114.655 21.8126C115.371 21.8126 115.98 21.6131 116.481 21.2143C116.982 20.8075 117.36 20.2371 117.615 19.5033C117.877 18.7694 118.009 17.9079 118.009 16.9188C118.009 15.9297 117.877 15.0722 117.615 14.3463C117.36 13.6204 116.982 13.058 116.481 12.6592C115.988 12.2603 115.379 12.0609 114.655 12.0609C113.939 12.0609 113.33 12.2563 112.829 12.6472C112.328 13.0381 111.942 13.5965 111.671 14.3223C111.409 15.0482 111.277 15.9137 111.277 16.9188Z"
        fill="#F59E0B"
      />
    </svg>
  );
}
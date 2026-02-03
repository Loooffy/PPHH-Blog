'use client';

interface MovieTicketSVGProps {
  width?: number;
  height?: number;
  className?: string;
  imageUrl?: string;
  idPrefix?: string;
  contentText?: string;
  publishDateText?: string;
}

export function MovieTicketSVG({
  width = 325,
  height = 160,
  className = '',
  imageUrl,
  idPrefix,
  contentText,
  publishDateText
}: MovieTicketSVGProps) {
  // 門票的主要顏色
  const ticketColor = '#F5F5DC'; // 淺米色
  const textColor = '#3E2723'; // 深棕色
  const borderColor = '#8D6E63'; // 棕色邊框
  const defsPrefix = idPrefix ? `movie-ticket-${idPrefix}` : 'movie-ticket-default';
  const dashedLineId = `${defsPrefix}-dashed-line`;
  const barcodeId = `${defsPrefix}-barcode`;
  const imageClipId = `${defsPrefix}-image-clip`;

  // 計算存根區域的寬度（約 20%）
  const stubWidth = width * 0.2;
  const mainWidth = width - stubWidth;

  // 左側圖片區域寬度（約 35%）
  const imageAreaWidth = mainWidth * 0.35;
  const textAreaWidth = mainWidth * 0.65;
  const textStartX = imageAreaWidth + 10;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}
      preserveAspectRatio="none"
    >
      {/* 定義虛線樣式 */}
      <defs>
        <pattern
          id={dashedLineId}
          x="0"
          y="0"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill={borderColor} opacity="0.6" />
        </pattern>

        {/* 條碼樣式 */}
        <pattern
          id={barcodeId}
          x="0"
          y="0"
          width="2"
          height="100%"
          patternUnits="userSpaceOnUse"
        >
          <rect width="1" height="100%" fill={textColor} opacity="0.3" />
        </pattern>

        {/* 左側圖片裁切區域 */}
        <clipPath id={imageClipId}>
          <rect x="0" y="0" width={imageAreaWidth} height={height} rx="2" />
        </clipPath>
      </defs>

      {/* 主票券背景 */}
      <rect
        x="0"
        y="0"
        width={mainWidth}
        height={height}
        fill={ticketColor}
        rx="2"
      />

      {/* 左側圖片 */}
      {imageUrl && (
        <image
          href={imageUrl}
          x="0"
          y="0"
          width={imageAreaWidth}
          height={height}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${imageClipId})`}
        />
      )}

      {/* 左側圖片區域邊框 */}
      <rect
        x="0"
        y="0"
        width={imageAreaWidth}
        height={height}
        fill="none"
        stroke={borderColor}
        strokeWidth="1"
        strokeOpacity="0.2"
        rx="2"
      />

      {/* 右側文字區域分隔線 */}
      <line
        x1={imageAreaWidth}
        y1="0"
        x2={imageAreaWidth}
        y2={height}
        stroke={borderColor}
        strokeWidth="1"
        strokeOpacity="0.2"
        strokeDasharray="2,2"
      />

      {/* 存根區域虛線邊緣 */}
      <path
        d={`M ${mainWidth} 0 L ${mainWidth} ${height}`}
        stroke={borderColor}
        strokeWidth="2"
        strokeDasharray="3,3"
        fill="none"
      />

      {/* 存根區域背景 */}
      <rect
        x={mainWidth}
        y="0"
        width={stubWidth}
        height={height}
        fill={ticketColor}
        opacity="0.8"
      />

      {/* 存根區域垂直條碼 */}
      <rect
        x={mainWidth + stubWidth * 0.2}
        y={height * 0.1}
        width={stubWidth * 0.6}
        height={height * 0.8}
        fill={`url(#${barcodeId})`}
        opacity="0.4"
      />

      {/* 內容預覽文字 */}
      {contentText && (
        <text
          x={textStartX}
          y={height * 0.7}
          fill={textColor}
          fontSize="10"
          fontFamily="sans-serif"
          opacity="0.85"
        >
          {contentText}
        </text>
      )}

      {/* 發佈日期文字 */}
      {publishDateText && (
        <text
          x={textStartX}
          y={height * 0.85}
          fill={textColor}
          fontSize="9"
          fontFamily="sans-serif"
          opacity="0.7"
        >
          {publishDateText}
        </text>
      )}

      {/* 底部裝飾線條 */}
      <line
        x1={mainWidth * 0.1}
        y1={height * 0.9}
        x2={mainWidth * 0.9}
        y2={height * 0.9}
        stroke={borderColor}
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeDasharray="1,1"
      />

      {/* 裝飾性幾何圖案（右下角） */}
      <circle
        cx={mainWidth * 0.85}
        cy={height * 0.85}
        r="3"
        fill={borderColor}
        opacity="0.2"
      />
    </svg>
  );
}

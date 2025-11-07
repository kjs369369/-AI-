
import type { CameraAngle } from './types';

export const MAX_IMAGES = 10;
export const MIN_IMAGES = 1;
export const MAX_FILE_SIZE_MB = 10;

export const CAMERA_ANGLES: CameraAngle[] = [
  { name: '클로즈업', value: 'Close-up' },
  { name: '미디엄 샷', value: 'Medium shot' },
  { name: '롱 샷 (전신)', value: 'Long shot (full body)' },
  { name: '아이레벨 샷', value: 'Eye-level shot' },
  { name: '하이 앵글', value: 'High angle' },
  { name: '로우 앵글', value: 'Low angle' },
  { name: '익스트림 클로즈업', value: 'Extreme close-up' },
  { name: '버드아이 뷰', value: 'Bird\'s-eye view' },
  { name: '더치 앵글', value: 'Dutch angle' },
  { name: '오버 더 숄더 샷', value: 'Over-the-shoulder shot' },
];

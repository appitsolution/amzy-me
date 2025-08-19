export interface JobSizeMapItem {
  value: string;
  label: string;
  icon: string;
}

export type JobSizeMapping = Record<string, JobSizeMapItem>;

export const jobSizeMapping: JobSizeMapping = {
  '1': { value: '1', label: 'Mini', icon: '/icons/mini.svg' },
  '2': { value: '2', label: 'Pickup load', icon: '/icons/pickup.svg' },
  '3': { value: '3', label: 'Pickup load x2', icon: '/icons/pickup2.svg' },
  '4': { value: '4', label: 'Dump Truck', icon: '/icons/dump.svg' },
  '5': { value: '5', label: 'Dump Truck +', icon: '/icons/dump_truck.svg' },
};



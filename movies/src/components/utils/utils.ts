
export const imgSrc = (img: string) => {
  return img
    ? `https://image.tmdb.org/t/p/original/${img}`
    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE1BFq0h-RvrEBWCMPudD2QMYcG2BDJVDYNw&usqp=CAU';
};


export const voteColor = (vote: number) => {
  if (vote > 7) return '#66e900';
  if (vote > 5) return '#e9d100';
  if (vote > 3) return '#e97e00';
  return '#e90000';
};
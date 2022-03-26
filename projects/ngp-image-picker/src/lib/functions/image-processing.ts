import { IState } from '../components/edit-image/edit-image.component';

export const convertImageUsingCanvas = (
  datas,
  changeHeight = false,
  state: IState,
  options?: { getDimFromImage?: boolean },
): Promise<string> => {
  return new Promise(async (resolve, _) => {
    let img = document.createElement('img');
    img.src = datas + '';
    img.crossOrigin = 'Anonymous';
    let quality = state.quality / 100;
    let maintainRatio = state.maintainAspectRatio;

    img.onload = () => {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      let ratio = img.width / img.height;
      let width = state.maxWidth;
      let height = state.maxHeight;

      if (options?.getDimFromImage) {
        width = img.width;
        height = img.height;
      }

      if (maintainRatio) {
        canvas.width = width;
        canvas.height = width / ratio;
        if (changeHeight) {
          canvas.width = height * ratio;
          canvas.height = height;
        }
      } else {
        canvas.width = width;
        canvas.height = height;
      }
      // ctx.filter=`sepia(1)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let type = state.format;
      var dataURI = canvas.toDataURL(`image/${type}`, quality);
      resolve({
        dataUri: dataURI,
        width: canvas.width,
        height: canvas.height,
      });
    };
  }).then((data: any) => {
    state.maxHeight = data.height;
    state.maxWidth = data.width;

    if (state.arrayCopiedImages.length <= 20) {
      state.arrayCopiedImages.push({
        lastImage: data.dataUri,
        width: state.maxWidth,
        height: state.maxHeight,
        quality: state.quality,
        format: state.format,
        originImageSrc: state.originImageSrc,
      });
    } else {
      state.arrayCopiedImages[state.arrayCopiedImages.length - 1] = {
        lastImage: data.dataUri,
        width: state.maxWidth,
        height: state.maxHeight,
        quality: state.quality,
        format: state.format,
        originImageSrc: state.originImageSrc,
      };
    }
    return data.dataUri;
  });
};

export const dragElement = (elemnt) => {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elemnt.id + '-header')) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elemnt.id + '-header').onmousedown = dragPressOn;
    document.getElementById(elemnt.id + '-header').ontouchstart = dragPressOn;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elemnt.ontouchstart = dragPressOn;
    elemnt.onmousedown = dragPressOn;
  }

  function dragPressOn(e) {
    let popup: any = document.querySelector('#popup');
    popup.style.overflowY = 'hidden';
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.ontouchend = closeDragElement;
    document.onmouseup = closeDragElement;
    document.ontouchmove = elementDragTouch;
    document.onmousemove = elementDragMouse;
  }

  function elementDragMouse(e) {
    let holderImage = document.getElementById('image-full');
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos3 = e.clientX;
    pos2 = pos4 - e.clientY;
    pos4 = e.clientY;

    let newTop = elemnt.offsetTop - pos2;
    let newLeft = elemnt.offsetLeft - pos1;
    let rectHolder = holderImage.getBoundingClientRect();
    let rectElemnt = elemnt.getBoundingClientRect();
    // console.log('====================================');
    // console.log(rectElemnt,rectHolder);
    // console.log('====================================');
    newTop = Math.max(newTop, rectHolder.top);
    newTop = Math.min(newTop, rectHolder.bottom - rectElemnt.height);
    newLeft = Math.max(newLeft, rectHolder.left);
    newLeft = Math.min(newLeft, rectHolder.right - rectElemnt.width);
    elemnt.style.top = newTop + 'px';
    elemnt.style.left = newLeft + 'px';
  }

  function elementDragTouch(e) {
    let holderImage = document.getElementById('image-full');
    e = e || window.event;

    if (e?.changedTouches?.length) {
      pos1 = pos3 - e.changedTouches[0]?.clientX;
      pos3 = e.changedTouches[0]?.clientX;
    }
    if (e?.changedTouches?.length) {
      pos2 = pos4 - e.changedTouches[0]?.clientY;
      pos4 = e.changedTouches[0]?.clientY;
    }

    let newTop = elemnt.offsetTop - pos2;
    let newLeft = elemnt.offsetLeft - pos1;
    let rectHolder = holderImage.getBoundingClientRect();
    let rectElemnt = elemnt.getBoundingClientRect();

    // console.log('====================================');
    // console.log(rectElemnt,rectHolder);
    // console.log('====================================');

    newTop = Math.max(newTop, rectHolder.top);
    newTop = Math.min(newTop, rectHolder.bottom - rectElemnt.height);
    newLeft = Math.max(newLeft, rectHolder.left);
    newLeft = Math.min(newLeft, rectHolder.right - rectElemnt.width);
    elemnt.style.top = newTop + 'px';
    elemnt.style.left = newLeft + 'px';
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    let popup: any = document.querySelector('#popup');
    popup.style.overflowY = 'auto';
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }
};

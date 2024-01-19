// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import '@blocksuite/presets/themes/affine.css';

import {createEmptyPage, DocEditor,} from '@blocksuite/presets';
import {Job} from '@blocksuite/store';
import {convertFlatObjectToSnapshot, getCurrentBlockId, getMsg, sendMsg} from "./utils";

const page = await createEmptyPage().init();
const editor = new DocEditor();
editor.page = page;
const job = new Job({workspace: page.workspace});

document.addEventListener('message', async (nativeEvent: any) => {
  const data = getMsg(nativeEvent);
  if (data.key === 'initBlock') {
    const initSnapshot = convertFlatObjectToSnapshot(JSON.parse(data.value));
    job.snapshotToBlock(initSnapshot, page).then(() => {
    });

    document.body.appendChild(editor);
  }

  if (data.key === 'addBlock') {
    sendMsg('from web', 'he')
    const id = getCurrentBlockId(editor.host);
    if (id) {
      const currentBlock = page.getBlockById(id)
      if (currentBlock) page.updateBlock(currentBlock, {type: 'h1'})
    }
  }
})

// page.spaceDoc.on("update", async _ => {
//   const id = getCurrentBlockId(editor.host);
//
//   console.log(id)
//
//   if (page.root) {
//     const snapshot = await job.blockToSnapshot(page.root);
//     const data = convertSnapshotToFlatObject(snapshot)
//
//     console.log(data)
//   }
// });

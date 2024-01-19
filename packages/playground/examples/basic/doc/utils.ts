import type {BlockSnapshot} from "@blocksuite/store";
import {EditorHost} from "@blocksuite/lit";

const select = function(arr: any, fn: any){
  var na: any = [];
  if (!arr || !arr.length){
    return na;
  }

  for (var i=0; i<arr.length; i++){
    var e=fn(arr[i], i, arr.length);
    if (e!==null){
      na.push(e);
    }
  }
  return na;
}

const extract = function(arr: any, key: any) {
  return select(arr, function (e: any) {
    if (key in e) {
      return e[key];
    }

    return null;
  });
}

export function convertSnapshotToFlatObject(snapshot: BlockSnapshot){

  let blocks_data: {[id: string]: any} = {};

  let iterate = function(block_data: any){
    blocks_data[block_data.id] = block_data;
    (block_data.children || []).map((child: any) => iterate(child));
  }

  iterate(snapshot);

  let block_ids = Object.keys(blocks_data);
  for (let i = 0; i < block_ids.length; i++){
    let block_id = block_ids[i];
    blocks_data[block_id].children = extract(blocks_data[block_id].children, 'id');
  }

  return blocks_data;
}

export function convertFlatObjectToSnapshot(blocks_data: {[id: string]: any}){
  let block_ids = Object.keys(blocks_data);
  for (let i = 0; i < block_ids.length; i++){
    let block_id = block_ids[i];
    blocks_data[block_id].children =
      blocks_data[block_id].children.map((e: any) => blocks_data[e]);
  }

  return Object.values(blocks_data)
    .find(e => e.flavour == 'affine:page') as BlockSnapshot;
}

export const getCurrentBlockId = (host: EditorHost) => {
  let blockId: string|undefined = undefined;

  host?.std?.command
    .pipe()
    .withHost()
    .getTextSelection()
    .getSelectedBlocks()
    .inline(ctx => {
      const { selectedBlocks } = ctx;
      blockId = selectedBlocks?.[0]?.dataset?.blockId;
    }).run();

  return blockId
}

const NATIVE_KEY = '__123native321__';
const WEB_KEY = '__456web654__';

export const sendMsg = (key: string, msg: string) => {
  //@ts-ignore
  window.ReactNativeWebView.postMessage(key + WEB_KEY +msg)
}

export const getMsg = ({data}: {data: any}) => {
  const [key, value] = data.split(NATIVE_KEY)
  return {
    key,
    value
  }
}

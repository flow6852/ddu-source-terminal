import {
  BaseSource,
  Item,
} from "https://deno.land/x/ddu_vim@v1.1.0/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v1.1.0/deps.ts";

type ActionData = {
  bufnr: number;
  path: string;
};

type ActionInfo = {
  word: string;
  action: ActionData;
};

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  kind = "terminal";

  gather(args: {
    denops: Denops;
  }): ReadableStream<Item<ActionData>[]> {
    const get_actioninfo = async(bufnr_: number, path: string): ActionInfo => {
      const curnr_ = await fn.bufnr(args.denops, "%");
      const altnr_ = await fn.bufnr(args.denops, "#");
      const name_ = await fn.bufname(args.denops, bufnr_);

      return {
        word: `${bufnr_} ${name_}`,
        action: {
          bufNr: bufnr_,
          path: path,
        }
      };
    };

    const get_buflist = async() => {
      const buffers: Item<ActionData>[] = [];
      const lastnr_ = await fn.bufnr(args.denops, "$");
      let path = "";

      for (let i = 1; i <= lastnr_; ++i ) {
        if(await fn.getbufvar(args.denops, i, "&buftype") === "terminal"){
          path = await fn.expand(args.denops, `#${i}:p`);
          buffers.push(await get_actioninfo(i, path));
        }
      }
      return buffers;
    };

    return new ReadableStream({
      async start(controller) {
        controller.enqueue(
          await get_buflist(),
        );
        controller.close();
      },
    });
  }

  params(): Params {
    return {};
  }
}

import cmds from "./cmds.js";
import ZipEdit from "./ZipEdit.js";
import GZipEdit from "./GZipEdit.js";

exports.activate = function (context) {
  cmds.register();
  ZipEdit.register(context);
  GZipEdit.register();
};

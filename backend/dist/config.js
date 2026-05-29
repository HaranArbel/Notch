"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
const configFile = node_fs_1.default.readFileSync('local.env').toString();
const configUnparsed = dotenv_1.default.parse(configFile);
const configSchema = zod_1.z.object({
    PORT: zod_1.z.number({ coerce: true })
});
exports.config = configSchema.parse(configUnparsed);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxzREFBeUI7QUFDekIsb0RBQTRCO0FBQzVCLDZCQUFzQjtBQUV0QixNQUFNLFVBQVUsR0FBRyxpQkFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMzRCxNQUFNLGNBQWMsR0FBRyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUVoRCxNQUFNLFlBQVksR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQzFCLElBQUksRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxDQUFDO0NBQ2pDLENBQUMsQ0FBQztBQUNVLFFBQUEsTUFBTSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMifQ==
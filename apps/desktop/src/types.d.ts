declare module "qrcode"
{
	export function toDataURL(text: string | Buffer, options?: any): Promise<string>;

	export function toBuffer(text: string | Buffer, options?: any): Promise<Buffer>;

	export function toString(text: string | Buffer, options?: any): Promise<string>;
}
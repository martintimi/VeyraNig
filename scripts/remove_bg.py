import os
import sys
from PIL import Image

def remove_background_batch():
    input_dir = os.path.join(os.getcwd(), 'public', 'images', 'products')
    output_dir = os.path.join(os.getcwd(), 'public', 'images', 'products', 'cutouts')
    os.makedirs(output_dir, exist_ok=True)

    print(f"Reading images from: {input_dir}")
    print(f"Outputting cutouts to: {output_dir}")

    # Check if rembg is available
    has_rembg = False
    try:
        from rembg import remove
        has_rembg = True
        print("Using AI-powered 'rembg' for precision background removal...")
    except ImportError:
        print("rembg not installed yet, using PIL smart thresholding...")

    valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    files = [f for f in os.listdir(input_dir) if f.lower().endswith(valid_extensions) and not os.path.isdir(os.path.join(input_dir, f))]

    processed_count = 0
    for filename in sorted(files):
        in_path = os.path.join(input_dir, filename)
        base_name, _ = os.path.splitext(filename)
        out_path = os.path.join(output_dir, f"{base_name}.png")

        try:
            with Image.open(in_path) as img:
                img = img.convert("RGBA")
                
                if has_rembg:
                    from rembg import remove
                    out_img = remove(img)
                else:
                    # Fallback smart corner background sampler & alpha transparency
                    datas = img.getdata()
                    bg_color = datas[0] # Sample top-left corner
                    new_data = []
                    threshold = 35
                    for item in datas:
                        # If color is close to white/grey background
                        is_bg = (
                            abs(item[0] - bg_color[0]) < threshold and
                            abs(item[1] - bg_color[1]) < threshold and
                            abs(item[2] - bg_color[2]) < threshold
                        ) or (item[0] > 235 and item[1] > 235 and item[2] > 235)
                        if is_bg:
                            new_data.append((255, 255, 255, 0))
                        else:
                            new_data.append(item)
                    img.putdata(new_data)
                    out_img = img

                # Auto-crop transparent boundaries
                bbox = out_img.getbbox()
                if bbox:
                    out_img = out_img.crop(bbox)

                out_img.save(out_path, "PNG")
                processed_count += 1
                print(f"[{processed_count}/{len(files)}] Cutout saved: {base_name}.png")
        except Exception as e:
            print(f"Failed to process {filename}: {e}")

    print(f"\nAll {processed_count} product cutouts successfully generated in {output_dir}!")

if __name__ == '__main__':
    remove_background_batch()

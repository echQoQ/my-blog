import re
import os
import shutil

def modify_links_in_file(file_path, source_dir, target_dir):
    # 检查目标目录是否存在，如果不存在则创建
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # 找到所有匹配的链接
    links = re.findall(r'!\[\[Pasted image (.*).png\]\]', content)
    
    for link in links:
        print(link)
        # 构建原始文件路径
        original_file_path = os.path.join(source_dir, f'Pasted image {link}.png')
        
        # 检查文件是否存在
        if os.path.exists(original_file_path):
            # 构建目标文件路径
            target_file_path = os.path.join(target_dir, f'{link}.png')
            
            # 复制文件并重命名
            shutil.copy2(original_file_path, target_file_path)
            print(f'Copied and renamed {original_file_path} to {target_file_path}')
            
            # 修改文件中的链接
            content = content.replace(f'![[Pasted image {link}.png]]', f'![]({f"/images/{link}.png"})')
        else:
            print(f'File not found: {original_file_path}')
    
    # 将修改后的内容写回文件
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

current_dir = os.getcwd()
files = [f for f in os.listdir(current_dir) if os.path.isfile(os.path.join(current_dir, f))]

source_dir = 'D:\\\\文档\\HackerNote\\附件'  # 替换为源目录路径
target_dir = 'D:\\\\MY-BLOG\\my-blog\\src\\.vuepress\\public\\images'  # 替换为目标目录路径

# 执行函数

for fp in files:
    modify_links_in_file(fp, source_dir, target_dir)
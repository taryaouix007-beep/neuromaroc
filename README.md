This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# neuromaroc




### Copilot

echo "alias local-copilot='COPILOT_PROVIDER_BASE_URL=http://localhost:11434/v1 COPILOT_MODEL=deepseek-coder-v2:16b COPILOT_PROVIDER_MAX_PROMPT_TOKENS=32768 COPILOT_PROVIDER_MAX_OUTPUT_TOKENS=8192 copilot'" >> ~/.zshrc



echo "alias local-copilot='COPILOT_PROVIDER_BASE_URL=http://localhost:11434/v1 COPILOT_MODEL=gemma4:31b-cloud COPILOT_PROVIDER_MAX_PROMPT_TOKENS=32768 COPILOT_PROVIDER_MAX_OUTPUT_TOKENS=8192 copilot'" >> ~/.zshrc

source ~/.zshrc


local-copilot





echo "alias local-copilot='COPILOT_PROVIDER_BASE_URL=http://localhost:11434/v1 COPILOT_MODEL=gemma4:31b-cloud COPILOT_PROVIDER_MAX_PROMPT_TOKENS=32768 COPILOT_PROVIDER_MAX_OUTPUT_TOKENS=8192 copilot'" >> ~/.zshrc

source ~/.zshrc


local-copilot


ollama list
macbook@192 nextjs % ollama launch copilot            
macbook@192 nextjs % echo "alias local-copilot='COPILOT_PROVIDER_BASE_URL=http://localhost:11434/v1 COPILOT_MODEL=qwen3.6:latest COPILOT_PROVIDER_MAX_PROMPT_TOKENS=32768 COPILOT_PROVIDER_MAX_OUTPUT_TOKENS=8192 copilot'" >> ~/.zshrc
macbook@192 nextjs % source ~/.zshrc

macbook@192 nextjs % local-copilot 

  
  ╭─╮╭─╮   Changes    +740 -53
  ╰─╯╰─╯   Duration   4h 15m 19s
  █ ▘▝ █   Tokens     ↑ 4.5m • ↓ 49.2k
   ▔▔▔▔    Resume     copilot --resume=dd108e4d-8094-4ffb-a8bf-1721803108d2

macbook@192 nextjs % ollama list
NAME                       ID              SIZE      MODIFIED     
llama3.1:8b                46e0c10c039e    4.9 GB    4 hours ago     
qwen2.5-coder:1.5b-base    02e0f2817a89    986 MB    4 hours ago     
nomic-embed-text:latest    0a109f422b47    274 MB    4 hours ago     
deepseek-coder-v2:16b      63fb193b3a9b    8.9 GB    27 hours ago    
kimi-k2.5:cloud            6d1c3246c608    -         13 days ago     
deepseek-v4-pro:cloud      22bfd5026abd    -         13 days ago     
deepseek-v4-flash:cloud    ea027821675c    -         13 days ago     
kimi-k2.6:cloud            a90cd0d1590c    -         13 days ago     
qwen3.6:latest             07d35212591f    23 GB     2 weeks ago     
gemma4:latest              c6eb396dbd59    9.6 GB    2 weeks ago     
macbook@192 nextjs % 
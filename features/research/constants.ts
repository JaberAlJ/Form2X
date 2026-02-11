import { PaperData } from './types';

export const INITIAL_PAPER_DATA: PaperData = {
    title: "Optimizing Transformer-Based Architectures for Real-Time Inference in Heterogeneous Edge Computing Environments",
    authors: [
        {
            id: 'a1',
            name: "Alex J. Engineering",
            dept: "Department of Electrical Engineering and Computer Science",
            org: "Massachusetts Institute of Technology",
            location: "Cambridge, MA, USA",
            email: "alex.eng@mit.edu"
        },
        {
            id: 'a2',
            name: "Jordan Smith",
            dept: "School of Engineering",
            org: "Innovation Institute of London",
            location: "London, UK",
            email: "j.smith@innovation.ac.uk"
        }
    ],
    abstract: "The deployment of large-scale transformer models on edge devices remains a significant challenge due to constrained computational resources. This paper presents a novel optimization framework that combines structural pruning with 4-bit quantization to achieve real-time inference latency on mobile processors. Our results demonstrate that by leveraging specialized hardware accelerators, we can reduce the model footprint by 75% while maintaining 98.5% of the baseline accuracy. We provide a detailed analysis of the energy-efficiency trade-offs and propose a dynamic scaling algorithm for varying network conditions.",
    keywords: "Edge Computing, Transformer Models, Model Compression, Real-Time Systems, Hardware Acceleration",
    sections: [
        {
            id: 's1',
            title: "Introduction",
            content: "The rapid proliferation of Internet of Things (IoT) devices has led to an explosion in data generation at the network edge. Traditional cloud-centric architectures struggle with latency and privacy concerns, driving the shift toward decentralized intelligence [cite:r1]. Specifically, the attention mechanism in transformers has redefined state-of-the-art performance in various domains, yet its quadratic complexity $O(n^2)$ remains a bottleneck for edge deployment [cite:r2].",
            level: 1
        },
        {
            id: 's2',
            title: "Proposed Methodology",
            content: "We define a hybrid optimization objective that minimizes both memory usage and execution time. Our core innovation lies in the Adaptive Pruning Layer (APL) which dynamically adjusts the sparsity based on available thermal headroom. The objective function is formulated as follows:",
            level: 1,
            equations: [
                {
                    id: 'eq1',
                    latex: "\\mathcal{L}_{total} = \\alpha \\cdot \\mathcal{L}_{accuracy} + \\beta \\cdot \\sum_{i=1}^{N} (w_i^2 \\cdot \sigma_i) + \\gamma \\cdot \\mathbb{E}[\\Delta T]"
                }
            ]
        },
        {
            id: 's2_1',
            title: "Quantization Strategies",
            content: "To further compress the model, we employ a mixed-precision approach where weights are represented using the following distribution:",
            level: 2,
            bulletPoints: [
                "Primary weights: 4-bit integer representation for linear layers.",
                "Sensitivity-critical parameters: 8-bit floating point for normalization layers.",
                "Dynamic scaling factors: 16-bit precision to prevent gradient vanishing [cite:r3].",
                "Activation caching: $L_1$ cache optimization for low-latency retrieval."
            ]
        },
        {
            id: 's3',
            title: "Experimental Evaluation",
            content: "We evaluated our framework across several standard benchmarks. Table I summarizes the performance improvements observed during our testing phase. The results indicate that structural pruning significantly outperforms unstructured methods in terms of cache hit rates.",
            level: 1,
            tables: [
                {
                    id: 't1',
                    caption: "Performance Benchmark Comparison",
                    rows: [
                        ["Model Type", "Latency (ms)", "Accuracy (%)", "Energy (mJ)"],
                        ["Baseline", "452.1", "92.4", "1250"],
                        ["Pruned (50%)", "210.4", "91.8", "580"],
                        ["Our Framework", "102.5", "91.2", "295"]
                    ]
                }
            ]
        },
        {
            id: 's3_1',
            title: "Implementation Details",
            content: "As shown in Fig. 1, the architecture utilizes a dual-pipeline system to maximize throughput. The data flow ensures that the bottleneck is shifted from I/O to compute, which is ideal for the latest generation of NPU-equipped processors.",
            level: 2,
            figures: [
                {
                    id: 'f1',
                    caption: "System Architecture of the Edge Inference Pipeline",
                    imageData: ""
                }
            ]
        }
    ],
    acknowledgment: "This work was supported in part by the National Science Foundation under Grant No. EEC-2025-X01 and the Global AI Research Initiative.",
    references: [
        { id: 'r1', text: "Y. Bengio, A. Courville, and P. Vincent, \"Representation Learning: A Review and New Perspectives,\" IEEE Trans. Pattern Anal. Mach. Intell., vol. 35, no. 8, pp. 1798–1828, Aug. 2013." },
        { id: 'r2', text: "A. Vaswani et al., \"Attention is All You Need,\" in Proc. 31st Int. Conf. Neural Inf. Process. Syst., 2017, pp. 5998–6008." },
        { id: 'r3', text: "S. Han, H. Mao, and W. J. Dally, \"Deep Compression: Compressing Deep Neural Networks with Pruning, Trained Quantization and Huffman Coding,\" in Proc. Int. Conf. Learn. Represent., 2016." }
    ],
    style: {
        fontFamily: 'Times New Roman',
        baseFontSize: 10,
        lineSpacing: 1.0,
        marginSize: 0.75,
        columnLayout: '2-column'
    }
};

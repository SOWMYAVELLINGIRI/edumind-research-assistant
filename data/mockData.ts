
import type { Paper, Module } from '../types';

export const MOCK_PAPERS: Paper[] = [
  {
    id: '1',
    title: 'Enhancing Reinforcement Learning with Meta-Heuristic Policy Optimization',
    authors: ['Dr. Elena Rodriguez', 'Marcus Thorne', 'Sarah Jenkins'],
    year: 2021,
    citations: 84,
    abstract: 'This paper introduces a novel meta-heuristic optimization framework for reinforcement learning agents. By integrating evolutionary strategies with deep Q-networks, our approach, termed Meta-Heuristic Policy Optimization (MHPO), demonstrates significant improvements in sample efficiency and final policy performance across a range of complex control tasks, including MuJoCo and Atari environments. We show that MHPO is less susceptible to local optima and can discover more robust policies compared to traditional gradient-based methods.'
  },
  {
    id: '2',
    title: 'Transformer-Based Architectures for Time-Series Forecasting in High-Frequency Trading',
    authors: ['Li Wei', 'James O\'Sullivan', 'Anika Patel'],
    year: 2022,
    citations: 112,
    abstract: 'High-frequency trading (HFT) demands accurate and rapid forecasting of financial time-series data. This work explores the application of Transformer-based neural network architectures, originally designed for natural language processing, to this domain. We propose a novel attention mechanism, the Temporal Attention Transformer (TAT), which effectively captures both short-term and long-term dependencies in volatile market data. Our model outperforms traditional ARIMA and LSTM models in predicting millisecond-level price movements, achieving a 15% increase in predictive accuracy.'
  },
  {
    id: '3',
    title: 'Zero-Shot Learning via Latent Space Alignment in Generative Adversarial Networks',
    authors: ['Samuel Richardson', 'Yumi Tanaka'],
    year: 2023,
    citations: 56,
    abstract: 'The study introduces LSA-GAN, a framework that aligns visual features and semantic attributes through a Generative Adversarial Network to improve zero-shot learning. The methodology employs a cycle-consistency loss to generate realistic synthetic data for unseen classes while minimizing the domain shift problem. Experimental results on the CUB and SUN datasets demonstrate state-of-the-art performance in generalized zero-shot learning tasks. The findings emphasize that structural alignment in latent spaces is essential for enhancing model generalization across novel, open-world categories.'
  },
   {
    id: '4',
    title: 'Federated Learning for Privacy-Preserving Medical Image Analysis',
    authors: ['Dr. Aisha Khan', 'Ben Carter'],
    year: 2022,
    citations: 98,
    abstract: 'This paper addresses the critical challenge of privacy in medical data by applying Federated Learning (FL) to diagnostic imaging. We develop a robust FL framework that allows multiple hospitals to collaboratively train a deep learning model for tumor detection without sharing sensitive patient data. Our approach incorporates differential privacy and secure aggregation to provide formal privacy guarantees. Results show that our federated model achieves diagnostic accuracy comparable to a centrally trained model, demonstrating the viability of privacy-preserving collaborative AI in healthcare.'
  },
  {
    id: '5',
    title: 'A Comprehensive Survey on Computer Vision using Deep Learning',
    authors: ['Jane Doe', 'John Smith'],
    year: 2023,
    citations: 250,
    abstract: 'This survey provides a comprehensive overview of the recent advancements in computer vision using deep learning techniques. We cover major topics including image classification, object detection, semantic segmentation, and image generation. We also discuss the challenges and future directions in the field of computer vision. This survey is intended for both new researchers and experts in the field of deep learning.'
  },
  {
    id: '6',
    title: 'Natural Language Processing with Transformers: A Practical Guide',
    authors: ['Alice Johnson', 'Bob Williams'],
    year: 2021,
    citations: 150,
    abstract: 'This paper serves as a practical guide for applying Transformer models to various Natural Language Processing (NLP) tasks. We cover the fundamental concepts of the Transformer architecture, including self-attention mechanisms and positional encodings. We provide code examples and best practices for fine-tuning pre-trained models like BERT and GPT for tasks such as text classification, question answering, and text generation.'
  },
  {
    id: '7',
    title: 'EfficientNet: Rethinking Model Scaling for Convolutional Neural Networks',
    authors: ['Mingxing Tan', 'Quoc V. Le'],
    year: 2019,
    citations: 10000,
    abstract: 'This paper proposes a new model scaling method that uniformly scales all dimensions of depth/width/resolution using a simple yet highly effective compound coefficient. We demonstrate that this method can lead to better accuracy and efficiency than previous approaches. Our EfficientNet models achieve state-of-the-art accuracy on ImageNet while being up to 10x smaller and faster.'
  }
];

export const MOCK_MODULES: Module[] = [
    { id: 'module1', title: 'Introduction to Reinforcement Learning', description: 'Understand the fundamentals of RL, agents, and environments.', progress: 0 },
    { id: 'module2', title: 'Deep Q-Networks (DQN)', description: 'Learn how deep learning is used to approximate Q-values.', progress: 0 },
    { id: 'module3', title: 'Policy Gradient Methods', description: 'Explore methods that directly optimize the policy function.', progress: 0 },
    { id: 'module4', title: 'Transformer Architectures', description: 'Dive into the attention mechanism and its applications.', progress: 0 },
    { id: 'module5', title: 'Generative Adversarial Networks (GANs)', description: 'Understand the two-player game of generator and discriminator.', progress: 0 }
];

import { NodeSDK } from '@opentelemetry/sdk-node';
// import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';


const sdk = new NodeSDK({
  // traceExporter: new ConsoleSpanExporter(),
  metricReaders: [
    new PrometheusExporter({
      port: 9464,
      endpoint: '/metrics',
    }),
  ],
  instrumentations: [
    getNodeAutoInstrumentations(),  // auto instrumentations for built-in modules and common packages
    new PinoInstrumentation(),      // attach to and send pino logs to opentelemetry logging sdk
  ],
});


sdk.start();


const handleShutdown = () => {
  try {
    console.info('Shutting down telemetry');
    sdk.shutdown();
  } catch (error) {
    console.error('Error shutting down telemetry', error);
  }
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

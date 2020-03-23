use regex::Regex;
use std::sync::Arc;
use std::sync::RwLock;
use swc_common;
use swc_common::comments::CommentKind;
use swc_common::comments::Comments;
use swc_common::errors::Diagnostic;
use swc_common::errors::DiagnosticBuilder;
use swc_common::errors::Emitter;
use swc_common::errors::Handler;
use swc_common::errors::HandlerFlags;
use swc_common::SourceMap;
use swc_common::Span;

pub type SwcDiagnostics = Vec<Diagnostic>;

#[derive(Clone, Default)]
pub struct BufferedError(Arc<RwLock<SwcDiagnostics>>);

impl Emitter for BufferedError {
  fn emit(&mut self, db: &DiagnosticBuilder) {
    self.0.write().unwrap().push((**db).clone());
  }
}

impl From<BufferedError> for Vec<Diagnostic> {
  fn from(buf: BufferedError) -> Self {
    let s = buf.0.read().unwrap();
    s.clone()
  }
}

pub struct DocParser {
  pub buffered_error: BufferedError,
  pub source_map: Arc<SourceMap>,
  pub handler: Handler,
  pub comments: Comments,
}

impl DocParser {
  pub fn default() -> Self {
    let buffered_error = BufferedError::default();

    let handler = Handler::with_emitter_and_flags(
      Box::new(buffered_error.clone()),
      HandlerFlags {
        dont_buffer_diagnostics: true,
        can_emit_warnings: true,
        ..Default::default()
      },
    );

    DocParser {
      buffered_error,
      source_map: Arc::new(SourceMap::default()),
      handler,
      comments: Comments::default(),
    }
  }

  pub fn js_doc_for_span(&self, span: Span) -> Option<String> {
    let comments = self.comments.take_leading_comments(span.lo())?;
    let js_doc_comment = comments.iter().find(|comment| {
      comment.kind == CommentKind::Block && comment.text.starts_with('*')
    })?;

    let mut margin_pat = String::from("");
    if let Some(margin) = self.source_map.span_to_margin(span) {
      for _ in 0..margin {
        margin_pat.push(' ');
      }
    }

    let js_doc_re = Regex::new(r#" ?\* ?"#).unwrap();
    let txt = js_doc_comment
      .text
      .split('\n')
      .map(|line| js_doc_re.replace(line, "").to_string())
      .map(|line| line.trim_start_matches(&margin_pat).to_string())
      .collect::<Vec<String>>()
      .join("\n");

    let txt = txt.trim_start().trim_end().to_string();

    Some(txt)
  }
}

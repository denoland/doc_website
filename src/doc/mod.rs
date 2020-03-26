pub mod class;
pub mod r#enum;
pub mod function;
pub mod interface;
pub mod module;
pub mod namespace;
mod node;
pub mod parser;
pub mod ts_type;
pub mod type_alias;
pub mod variable;

pub use node::DocNode;
pub use node::DocNodeKind;
pub use node::Location;
pub use node::ParamDef;
pub use parser::DocParser;

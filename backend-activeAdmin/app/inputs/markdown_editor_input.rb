# frozen_string_literal: true

class MarkdownEditorInput < Formtastic::Inputs::TextInput
  def input_html_options
    super.merge(
      class: "markdown-editor-textarea",
      rows: 15,
      "data-markdown-editor": "true"
    )
  end
end

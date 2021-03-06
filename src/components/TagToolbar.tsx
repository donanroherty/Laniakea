import React from 'react'
import styled, { withTheme } from 'styled-components'
import { ThemeInterface } from 'theme/theme'
import { lighten } from 'polished'
import useTags from 'state/hooks/useTags'

interface TagToolbarProps {
  theme: ThemeInterface
}

const TagToolbar: React.FC<TagToolbarProps> = () => {
  const { beginAddTag } = useTags()

  return (
    <Wrapper>
      {/* <Button onClick={beginAddTag} data-testid="add-tag-button">
        <div>+</div>
      </Button> */}

      <div>
        {/* <ShortcutNotice>shift + click tag to rename</ShortcutNotice> */}
        {/* <ShortcutNotice>ctrl + click tag to delete</ShortcutNotice> */}
        <ShortcutNotice>click a tag to search for it</ShortcutNotice>
        <ShortcutNotice>drag tags on a repo to tag it</ShortcutNotice>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`
const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 27px;
  height: 27px;
  border-radius: 10px;
  border: 2px solid ${({ theme }) => lighten(0.52, theme.color.primary)};
  color: ${({ theme }) => theme.color.primary};
  background-color: white;
  font-size: 16px;
  font-weight: 600;
  user-select: none;
  align-items: center;
`
const ShortcutNotice = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.color.border};
`

export default withTheme(TagToolbar)
